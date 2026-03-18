import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { scoreAssessment } from '@/data/assessment-questions';

const GHL_API = 'https://services.leadconnectorhq.com';
const GHL_LOCATION = 'BQJFK9oHXVAYJotxKSiR';

// Pipeline & Stage IDs
const PIPELINE_ID = 'MhDJya5HE7xtjb8aobH5';
const STAGES = {
    NEW_LEAD: '74ee68b4-0bef-43af-8a76-136dc2128187',
    PARTIAL: '63fafbfc-9343-4624-a232-90c805be119e',
    ABANDONED: 'd1deadbf-6bc4-4e51-8e4c-922e027f59e9',
    ASSESSMENT_COMPLETE: 'd7a4b4d2-40e5-45e1-b68e-f6fc65830fd9',
    ROADMAP_SENT: 'b2820fcf-92f8-444f-ba51-1286e6630e8e',
    DISCOVERY_CALL: 'a55470bf-ce0f-4286-8966-a7e47a1f56ce',
    CLOSED_WON: 'aa91c453-6eba-4baf-b289-87a02c170d92',
};

// Custom Field IDs
const CF = {
    RESUME_TOKEN: '4p7Aq0F6fO4P38v5xvK5',
    INDUSTRY: 'EcGN9jMdyRytBeef1Sdi',
    TIMELINE: 'G5VdsjTMKpbnTs5Y65wC',
    MONEY_LOSS: 'P4QHJDSjB8h6qmE2Jhpo',
    COMPLETED: 'Pd13OysTCKdMN99hiLHr',
    TEAM_SIZE: 'RDDn0RxYhQoaf8mLSrdR',
    RESUME_LINK: 'i2Dj1ynhjtAdnLuUKc8w',
    WEEKLY_WORKFLOW: 'sMGmeoPAcx1VpXJoswdv',
    // UTM Attribution
    UTM_SOURCE: 'bbFDlherPsgKzn6EznHH',
    UTM_MEDIUM: '9HL9S6QRlF7xW1R4udoK',
    UTM_CAMPAIGN: 'Qgwt9WzZM3iHveY4nmnM',
    UTM_CLICK_ID: 'DfXPKUmtAxRMuVvsi80N',
};

// ── Email Templates ────────────────────────────────────────────────────────

function confirmationEmail(firstName) {
    const name = firstName || 'there';
    return {
        subject: 'We received your assessment — here\'s what happens next',
        html: `
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #1a1a1a; padding: 0;">
  <div style="padding: 40px 32px 32px; border-bottom: 2px solid #111113;">
    <div style="font-size: 13px; font-weight: 700; letter-spacing: 0.12em; color: #111113; text-transform: uppercase; margin-bottom: 24px;">INTELLIVANCE</div>
    <h1 style="font-size: 26px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 14px; color: #111113;">We're on it, ${name}.</h1>
    <p style="font-size: 15px; color: #555555; line-height: 1.7; margin: 0;">Your operational diagnostic has been received. Our team is now reviewing your responses and building a custom AI roadmap for your business.</p>
  </div>
  <div style="padding: 28px 32px;">
    <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.15em; color: #999999; text-transform: uppercase; margin-bottom: 20px;">WHAT HAPPENS NEXT</div>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="border-top: 1px solid #eeeeee; padding: 16px 0;">
        <div style="font-size: 11px; color: #c87d1a; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">01 — NOW</div>
        <div style="font-size: 15px; font-weight: 700; color: #1a1a1a; margin: 6px 0 4px;">Confirmation received</div>
        <div style="font-size: 13px; color: #777777; line-height: 1.6;">This email confirms we have your responses. No action needed from you.</div>
      </td></tr>
      <tr><td style="border-top: 1px solid #eeeeee; padding: 16px 0;">
        <div style="font-size: 11px; color: #c87d1a; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">02 — WITHIN 24 HOURS</div>
        <div style="font-size: 15px; font-weight: 700; color: #1a1a1a; margin: 6px 0 4px;">Architecture analysis begins</div>
        <div style="font-size: 13px; color: #777777; line-height: 1.6;">We're mapping your workflow to identify bottlenecks, wasted hours, and the biggest opportunities to put AI to work.</div>
      </td></tr>
      <tr><td style="border-top: 1px solid #eeeeee; padding: 16px 0;">
        <div style="font-size: 11px; color: #c87d1a; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">03 — WITHIN 48 HOURS</div>
        <div style="font-size: 15px; font-weight: 700; color: #1a1a1a; margin: 6px 0 4px;">Custom roadmap delivered</div>
        <div style="font-size: 13px; color: #777777; line-height: 1.6;">Your operational roadmap will land right here in your inbox — specific solutions mapped to your exact pain points.</div>
      </td></tr>
    </table>
  </div>
  <div style="padding: 20px 32px; border-top: 1px solid #eeeeee; text-align: center;">
    <p style="font-size: 12px; color: #bbbbbb; margin: 0;">&#169; 2026 Intellivance &#183; <a href="https://intellivance.ai" style="color: #999999; text-decoration: none;">intellivance.ai</a></p>
  </div>
</div>`
    };
}

function abandonedEmail(firstName, resumeToken) {
    const name = firstName || 'there';
    const resumeLink = `https://intellivance.ai/assessment?token=${resumeToken}`;
    return {
        subject: 'Your assessment is waiting — pick up where you left off',
        html: `
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
</div>`
    };
}

// ── GHL Email Sender ───────────────────────────────────────────────────────

async function sendGHLEmail(contactId, subject, html, pitToken) {
    try {
        const res = await fetch(`${GHL_API}/conversations/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${pitToken}`,
                'Version': '2021-07-28',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'Email',
                contactId,
                subject,
                html,
                emailFrom: 'Intellivance <hello@intellivance.ai>',
            }),
        });
        if (!res.ok) {
            console.error('GHL email error:', res.status, await res.text());
            return false;
        }
        return true;
    } catch (e) {
        console.error('GHL email exception:', e);
        return false;
    }
}

// ── Main Handler ───────────────────────────────────────────────────────────

export async function POST(req) {
    try {
        const body = await req.json();
        const { token, formData, step, completed, honeypot, utmData } = body;

        if (honeypot && honeypot.length > 0) {
            return NextResponse.json({ success: true }, { status: 200 });
        }

        if (!token || !formData) {
            return NextResponse.json({ error: 'Missing required payload' }, { status: 400 });
        }

        let dbSuccess = false;
        let ghlSuccess = false;
        let emailSent = false;
        let contactId = null;

        // 1. Persist to Supabase
        if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
            try {
                const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
                // Build scored answers object if any q1-q6 answers exist
                const scoredAnswers = {};
                ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'].forEach(q => {
                    if (formData[q]) scoredAnswers[q] = formData[q];
                });
                const hasScored = Object.keys(scoredAnswers).length > 0;

                const { error } = await supabase
                    .from('assessments')
                    .upsert({
                        resume_token: token,
                        email: formData.email || null,
                        first_name: formData.firstName || null,
                        last_name: formData.lastName || null,
                        industry: formData.industry || null,
                        team_size: formData.teamSize || null,
                        weekly_workflow: formData.weeklyWorkflow || null,
                        money_loss: formData.moneyLoss || null,
                        timeline: formData.timeline || null,
                        website: formData.website || null,
                        phone: formData.phone || null,
                        current_step: step,
                        is_completed: completed || false,
                        updated_at: new Date().toISOString(),
                        // Scored assessment answers (q1-q6 stored as JSON)
                        scored_answers: hasScored ? JSON.stringify(scoredAnswers) : null,
                        // UTM tracking
                        utm_source: utmData?.utm_source || null,
                        utm_medium: utmData?.utm_medium || null,
                        utm_campaign: utmData?.utm_campaign || null,
                        utm_term: utmData?.utm_term || null,
                        utm_content: utmData?.utm_content || null,
                        click_id: utmData?.gclid || utmData?.msclkid || null,
                    }, { onConflict: 'resume_token' });

                if (error) console.error('Supabase error:', error);
                else dbSuccess = true;
            } catch (e) {
                console.error('Supabase exception:', e);
            }
        }

        // 2. Create/Update Contact in GHL
        if (process.env.GHL_PIT_TOKEN && formData.email) {
            try {
                const tags = ['assessment-lead'];
                let scoreResults = null;
                if (completed) {
                    tags.push('assessment-completed');
                    // Score the assessment and add rating tags for CRM triage
                    const answers = {};
                    ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'].forEach(q => {
                        if (formData[q]) answers[q] = formData[q];
                    });
                    if (Object.keys(answers).length === 6) {
                        scoreResults = scoreAssessment(answers);
                        tags.push(`score-${scoreResults.totalScore}`);
                        const ratingSlug = scoreResults.overallRating.toLowerCase().replace(/[^a-z]+/g, '-').replace(/-+$/, '');
                        tags.push(`rating-${ratingSlug}`);
                    }
                }
                if (formData.timeline === 'urgent') tags.push('urgent-timeline');
                if (formData.industry) tags.push(`industry-${formData.industry}`);

                // Build dynamic source from UTM data
                const utmSource = utmData?.utm_source || '';
                const utmMedium = utmData?.utm_medium || '';
                const source = utmSource && utmMedium
                    ? `${utmSource.charAt(0).toUpperCase() + utmSource.slice(1)} / ${utmMedium.toUpperCase()}`
                    : 'Intellivance Assessment Flow';

                const ghlPayload = {
                    locationId: GHL_LOCATION,
                    email: formData.email.toLowerCase().trim(),
                    firstName: formData.firstName || undefined,
                    lastName: formData.lastName || undefined,
                    phone: formData.phone || undefined,
                    website: formData.website || undefined,
                    tags,
                    source,
                };
                Object.keys(ghlPayload).forEach(k => ghlPayload[k] === undefined && delete ghlPayload[k]);

                const ghlRes = await fetch(`${GHL_API}/contacts/upsert`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.GHL_PIT_TOKEN}`,
                        'Version': '2021-07-28',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(ghlPayload),
                });

                if (ghlRes.ok) {
                    ghlSuccess = true;
                    const ghlData = await ghlRes.json();
                    contactId = ghlData?.contact?.id;

                    if (contactId) {
                        // 3. Populate custom fields on contact
                        const customFieldValues = [
                            { id: CF.RESUME_TOKEN, value: token },
                            { id: CF.RESUME_LINK, value: `https://intellivance.ai/assessment?token=${token}` },
                            { id: CF.COMPLETED, value: completed ? 'Yes' : 'No' },
                        ];
                        if (formData.industry) customFieldValues.push({ id: CF.INDUSTRY, value: formData.industry });
                        if (formData.timeline) customFieldValues.push({ id: CF.TIMELINE, value: formData.timeline });
                        if (formData.teamSize) customFieldValues.push({ id: CF.TEAM_SIZE, value: formData.teamSize });
                        if (formData.moneyLoss) customFieldValues.push({ id: CF.MONEY_LOSS, value: formData.moneyLoss });
                        if (formData.weeklyWorkflow) customFieldValues.push({ id: CF.WEEKLY_WORKFLOW, value: formData.weeklyWorkflow });

                        // UTM Attribution — write to GHL so leads are filterable by source
                        if (utmData?.utm_source) customFieldValues.push({ id: CF.UTM_SOURCE, value: utmData.utm_source });
                        if (utmData?.utm_medium) customFieldValues.push({ id: CF.UTM_MEDIUM, value: utmData.utm_medium });
                        if (utmData?.utm_campaign) customFieldValues.push({ id: CF.UTM_CAMPAIGN, value: utmData.utm_campaign });
                        const clickId = utmData?.gclid || utmData?.msclkid;
                        if (clickId) customFieldValues.push({ id: CF.UTM_CLICK_ID, value: clickId });

                        await fetch(`${GHL_API}/contacts/${contactId}`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${process.env.GHL_PIT_TOKEN}`,
                                'Version': '2021-07-28',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ customFields: customFieldValues }),
                        }).catch(e => console.error('Custom fields error:', e));

                        // 4. Create opportunity in Assessment Funnel pipeline
                        const stageId = completed ? STAGES.ASSESSMENT_COMPLETE : STAGES.NEW_LEAD;
                        const oppName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || formData.email;
                        await fetch(`${GHL_API}/opportunities/`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${process.env.GHL_PIT_TOKEN}`,
                                'Version': '2021-07-28',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                pipelineId: PIPELINE_ID,
                                pipelineStageId: stageId,
                                locationId: GHL_LOCATION,
                                contactId,
                                name: oppName,
                                status: 'open',
                                source: 'Intellivance Assessment Flow',
                            }),
                        }).catch(e => console.error('Opportunity create error:', e));

                        // 5. Send confirmation email on completed assessment
                        if (completed) {
                            const { subject, html } = confirmationEmail(formData.firstName);
                            emailSent = await sendGHLEmail(contactId, subject, html, process.env.GHL_PIT_TOKEN);

                            // 6. Add score breakdown as a CRM note
                            if (scoreResults) {
                                const CATEGORY_LABELS = { automation: 'Process Automation', techStack: 'Tech Stack', manualWork: 'Manual Work', scalability: 'Scalability' };
                                const noteLines = [
                                    `AI Readiness Score: ${scoreResults.totalScore}/100 — ${scoreResults.overallRating}`,
                                    '',
                                    ...Object.entries(scoreResults.categories).map(([k, v]) => {
                                        const r = scoreResults.ratings[k];
                                        return `${CATEGORY_LABELS[k] || k}: ${v}/25 (${r?.label || 'N/A'})`;
                                    }),
                                ];
                                await fetch(`${GHL_API}/contacts/${contactId}/notes`, {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': `Bearer ${process.env.GHL_PIT_TOKEN}`,
                                        'Version': '2021-07-28',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ body: noteLines.join('\n'), userId: contactId }),
                                }).catch(e => console.error('GHL note error:', e));
                            }
                        }
                    }
                } else {
                    console.error('GHL API Error:', await ghlRes.text());
                }
            } catch (e) {
                console.error('GHL exception:', e);
            }
        }

        return NextResponse.json({
            success: true,
            persisted: dbSuccess,
            syncedToGHL: ghlSuccess,
            emailSent,
            contactId,
        }, { status: 200 });

    } catch (error) {
        console.error('Submit error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
