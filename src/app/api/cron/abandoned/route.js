import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const GHL_API = 'https://services.leadconnectorhq.com';
const GHL_LOCATION = 'BQJFK9oHXVAYJotxKSiR';
const PIPELINE_ID = 'MhDJya5HE7xtjb8aobH5';
const STAGE_ABANDONED = 'd1deadbf-6bc4-4e51-8e4c-922e027f59e9';

// Vercel Cron Job: Runs daily at 9am UTC.
// Finds assessments where email was captured but form was NOT completed,
// and sends a follow-up email with a resume link via GHL.

function abandonedEmailHtml(firstName, resumeToken) {
    const name = firstName || 'there';
    const resumeLink = `https://intellivance.ai/assessment?token=${resumeToken}`;
    return `
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #1a1a1a; padding: 0;">
  <div style="padding: 40px 32px 32px; border-bottom: 2px solid #111113;">
    <div style="font-size: 13px; font-weight: 700; letter-spacing: 0.12em; color: #111113; text-transform: uppercase; margin-bottom: 24px;">INTELLIVANCE</div>
    <h1 style="font-size: 26px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 14px; color: #111113;">Hey ${name}, you were almost done.</h1>
    <p style="font-size: 15px; color: #555555; line-height: 1.7; margin: 0;">You started your free operations assessment but didn't finish. Your progress has been saved — it takes less than 2 minutes to complete.</p>
  </div>
  <div style="padding: 32px; text-align: center;">
    <p style="font-size: 14px; color: #666666; line-height: 1.7; margin: 0 0 24px;">Once you submit, we'll build a custom roadmap showing exactly where your business is bleeding time and money — and how to fix it.</p>
    <a href="${resumeLink}" style="display: inline-block; background: #111113; color: #ffffff; padding: 14px 32px; font-size: 14px; font-weight: 700; text-decoration: none; letter-spacing: 0.03em;">FINISH MY ASSESSMENT &#8594;</a>
    <p style="font-size: 12px; color: #999999; margin-top: 16px;">Free. No call required. Results in 48 hours.</p>
  </div>
  <div style="padding: 20px 32px; border-top: 1px solid #eeeeee; text-align: center;">
    <p style="font-size: 12px; color: #bbbbbb; margin: 0;">&#169; 2026 Intellivance &#183; <a href="https://intellivance.ai" style="color: #999999; text-decoration: none;">intellivance.ai</a></p>
  </div>
</div>`;
}

export async function GET(req) {
    // Verify cron secret (Vercel sets this automatically for cron jobs)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.VERCEL === '1') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pitToken = process.env.GHL_PIT_TOKEN;
    if (!pitToken || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
        return NextResponse.json({ error: 'Missing env vars' }, { status: 500 });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    // Find incomplete assessments with email, older than 30 min, not yet notified
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    const { data: abandoned, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('is_completed', false)
        .not('email', 'is', null)
        .lt('updated_at', thirtyMinAgo)
        .or('abandon_email_sent.is.null,abandon_email_sent.eq.false');

    if (error) {
        console.error('Supabase query error:', error);
        return NextResponse.json({ error: 'DB query failed' }, { status: 500 });
    }

    if (!abandoned || abandoned.length === 0) {
        return NextResponse.json({ processed: 0 });
    }

    let sent = 0;

    for (const assessment of abandoned) {
        try {
            // Look up contact in GHL by email
            const searchRes = await fetch(
                `${GHL_API}/contacts/?locationId=${GHL_LOCATION}&query=${encodeURIComponent(assessment.email)}&limit=1`,
                {
                    headers: {
                        'Authorization': `Bearer ${pitToken}`,
                        'Version': '2021-07-28',
                    },
                }
            );

            if (!searchRes.ok) continue;
            const searchData = await searchRes.json();
            const contactId = searchData?.contacts?.[0]?.id;
            if (!contactId) continue;

            // Send abandoned assessment email
            const html = abandonedEmailHtml(assessment.first_name, assessment.resume_token);
            const emailRes = await fetch(`${GHL_API}/conversations/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${pitToken}`,
                    'Version': '2021-07-28',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'Email',
                    contactId,
                    subject: 'Your assessment is waiting — pick up where you left off',
                    html,
                    emailFrom: 'Intellivance <hello@intellivance.ai>',
                }),
            });

            if (emailRes.ok) {
                // Mark as notified so we don't send again
                await supabase
                    .from('assessments')
                    .update({ abandon_email_sent: true })
                    .eq('resume_token', assessment.resume_token);

                // Move opportunity to Abandoned stage
                try {
                    const oppSearch = await fetch(
                        `${GHL_API}/opportunities/search?location_id=${GHL_LOCATION}&pipeline_id=${PIPELINE_ID}&contact_id=${contactId}&limit=1`,
                        { headers: { 'Authorization': `Bearer ${pitToken}`, 'Version': '2021-07-28' } }
                    );
                    if (oppSearch.ok) {
                        const oppData = await oppSearch.json();
                        const oppId = oppData?.opportunities?.[0]?.id;
                        if (oppId) {
                            await fetch(`${GHL_API}/opportunities/${oppId}`, {
                                method: 'PUT',
                                headers: { 'Authorization': `Bearer ${pitToken}`, 'Version': '2021-07-28', 'Content-Type': 'application/json' },
                                body: JSON.stringify({ pipelineStageId: STAGE_ABANDONED }),
                            });
                        }
                    }
                } catch (oppErr) { console.error('Opp stage update error:', oppErr); }

                sent++;
            }
        } catch (e) {
            console.error(`Failed for ${assessment.email}:`, e);
        }
    }

    return NextResponse.json({ processed: abandoned.length, sent });
}
