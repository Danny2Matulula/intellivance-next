import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const GHL_LOCATION_ID = 'BQJFK9oHXVAYJotxKSiR';

export async function POST(req) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email || !email.includes('@') || !email.includes('.')) {
            return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
        }

        let dbSuccess = false;
        let ghlSuccess = false;

        // 1. Persist to Supabase
        if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
            try {
                const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
                const { error } = await supabase
                    .from('subscribers')
                    .upsert({
                        email: email.toLowerCase().trim(),
                        source: 'website',
                        subscribed_at: new Date().toISOString(),
                        synced_to_ghl: true,
                    }, { onConflict: 'email' });

                if (error) {
                    console.error('Supabase Upsert Error:', error);
                } else {
                    dbSuccess = true;
                }
            } catch (dbError) {
                console.error('Supabase exception:', dbError);
            }
        }

        // 2. Create/Update Contact in GoHighLevel via API
        if (process.env.GHL_PIT_TOKEN) {
            try {
                const ghlRes = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.GHL_PIT_TOKEN}`,
                        'Version': '2021-07-28',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        locationId: GHL_LOCATION_ID,
                        email: email.toLowerCase().trim(),
                        tags: ['newsletter-subscriber'],
                        source: 'Intellivance Website Newsletter',
                    }),
                });

                if (ghlRes.ok) {
                    ghlSuccess = true;
                } else {
                    console.error('GHL API Error:', await ghlRes.text());
                }
            } catch (ghlError) {
                console.error('GHL exception:', ghlError);
            }
        }

        return NextResponse.json({
            success: true,
            persisted: dbSuccess,
            syncedToGHL: ghlSuccess,
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
