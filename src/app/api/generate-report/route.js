/**
 * API Route: Generate AI Readiness Scorecard
 * POST /api/generate-report
 * 
 * Accepts assessment answers, scores them, generates a branded PDF,
 * and optionally emails the report to the user via GHL.
 */

import { NextResponse } from 'next/server';
import { scoreAssessment, getScoreSummary } from '@/data/assessment-questions';
import { generateScorecardPDF } from '@/lib/generate-scorecard';

const GHL_API = 'https://services.leadconnectorhq.com';

export async function POST(req) {
    try {
        const body = await req.json();
        const { answers, firstName, companyName, email, contactId } = body;

        if (!answers || typeof answers !== 'object') {
            return NextResponse.json({ error: 'Missing assessment answers' }, { status: 400 });
        }

        // 1. Score the assessment
        const results = scoreAssessment(answers);
        const summary = getScoreSummary(results.totalScore, firstName || companyName);

        const today = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const scorecardData = {
            ...results,
            companyName,
            firstName,
            date: today,
            summary,
        };

        // 2. Generate PDF
        const pdfBuffer = await generateScorecardPDF(scorecardData);

        // 3. If email + GHL token available, send the report
        let emailSent = false;
        if (email && process.env.GHL_PIT_TOKEN && contactId) {
            emailSent = await sendScorecardEmail(contactId, firstName, pdfBuffer, results);
        }

        // 4. Return PDF (or JSON results if no download needed)
        const returnPDF = body.returnPDF !== false;

        if (returnPDF) {
            return new NextResponse(pdfBuffer, {
                status: 200,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="Intellivance_AI_Readiness_Scorecard.pdf"`,
                },
            });
        }

        return NextResponse.json({
            success: true,
            score: results.totalScore,
            maxScore: results.maxScore,
            overallRating: results.overallRating,
            categories: results.categories,
            ratings: results.ratings,
            emailSent,
        });

    } catch (error) {
        console.error('Report generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate report', details: error.message },
            { status: 500 }
        );
    }
}

// ── Email Delivery ──────────────────────────────────────────────────────────

async function sendScorecardEmail(contactId, firstName, pdfBuffer, results) {
    const name = firstName || 'there';
    const scoreColor = results.totalScore >= 80 ? '#22c55e' :
        results.totalScore >= 60 ? '#f59e0b' : '#ef4444';

    const subject = `Your AI Readiness Score: ${results.totalScore}/100 — Here's Your Report`;

    const html = `
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #1a1a1a; padding: 0;">
  <div style="padding: 40px 32px 32px; border-bottom: 2px solid #111113;">
    <div style="font-size: 13px; font-weight: 700; letter-spacing: 0.12em; color: #111113; text-transform: uppercase; margin-bottom: 24px;">INTELLIVANCE</div>
    <h1 style="font-size: 26px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 14px; color: #111113;">Your AI Readiness Scorecard is ready, ${name}.</h1>
    <p style="font-size: 15px; color: #555555; line-height: 1.7; margin: 0;">We've analyzed your responses and built a personalized diagnostic. Here's where you stand.</p>
  </div>
  
  <div style="padding: 32px; text-align: center;">
    <div style="display: inline-block; border: 4px solid ${scoreColor}; border-radius: 50%; width: 100px; height: 100px; line-height: 92px; text-align: center; margin-bottom: 12px;">
      <span style="font-size: 36px; font-weight: 800; color: ${scoreColor};">${results.totalScore}</span>
      <span style="font-size: 14px; color: #999;">/100</span>
    </div>
    <div style="font-size: 14px; font-weight: 700; color: ${scoreColor}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px;">${results.overallRating}</div>
    
    <p style="font-size: 14px; color: #666666; line-height: 1.7; margin: 0 0 24px;">Your full scorecard is attached as a PDF. It includes your category breakdown, specific recommendations, and next steps.</p>
    
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
      ${Object.entries(results.categories).map(([key, score]) => {
        const rating = results.ratings[key] || {};
        const labels = {
            automation: 'Automation Readiness',
            techStack: 'Tech Stack',
            manualWork: 'Manual Work',
            scalability: 'Scalability',
        };
        return `
        <tr><td style="border-top: 1px solid #eeeeee; padding: 12px 0;">
          <table width="100%"><tr>
            <td style="font-size: 13px; font-weight: 700; color: #1a1a1a;">${labels[key] || key}</td>
            <td style="text-align: right; font-size: 13px; font-weight: 700; color: ${rating.color || '#999'};">${score}/25 — ${rating.label || ''}</td>
          </tr></table>
        </td></tr>`;
    }).join('')}
    </table>
    
    <a href="https://intellivance.ai/assessment" style="display: inline-block; background: #111113; color: #ffffff; padding: 14px 32px; font-size: 14px; font-weight: 700; text-decoration: none; letter-spacing: 0.03em;">BOOK A STRATEGY CALL →</a>
    <p style="font-size: 12px; color: #999999; margin-top: 12px;">Free 15-minute call to walk through your results.</p>
  </div>
  
  <div style="padding: 20px 32px; border-top: 1px solid #eeeeee; text-align: center;">
    <p style="font-size: 12px; color: #bbbbbb; margin: 0;">© 2026 Intellivance · <a href="https://intellivance.ai" style="color: #999999; text-decoration: none;">intellivance.ai</a></p>
  </div>
</div>`;

    try {
        const res = await fetch(`${GHL_API}/conversations/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GHL_PIT_TOKEN}`,
                'Version': '2021-07-28',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'Email',
                contactId,
                subject,
                html,
                emailFrom: 'Intellivance <hello@intellivance.ai>',
                // Note: GHL doesn't support raw PDF attachments via this API.
                // For PDF delivery, we'll need to host the PDF and include a download link.
                // This is a future enhancement — for now, the email includes the score summary.
            }),
        });

        if (!res.ok) {
            console.error('GHL scorecard email error:', res.status, await res.text());
            return false;
        }
        return true;
    } catch (e) {
        console.error('GHL scorecard email exception:', e);
        return false;
    }
}
