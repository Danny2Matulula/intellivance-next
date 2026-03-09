"use client";

import { useEffect, useState } from 'react';

const UTM_STORAGE_KEY = 'intellivance_utm';

const UTM_PARAMS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'msclkid',
];

/**
 * Captures UTM parameters from the URL on first landing and persists
 * them in sessionStorage so they survive page navigation within the visit.
 * Returns the UTM object for downstream use (form submissions, conversion events).
 */
export function useUTM() {
    const [utmData, setUtmData] = useState({});

    useEffect(() => {
        // Check sessionStorage first (already captured this session)
        const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
        if (stored) {
            try {
                setUtmData(JSON.parse(stored));
                return;
            } catch { /* corrupted, re-capture */ }
        }

        // Capture from URL
        const params = new URLSearchParams(window.location.search);
        const captured = {};
        let hasAny = false;

        UTM_PARAMS.forEach(key => {
            const val = params.get(key);
            if (val) {
                captured[key] = val;
                hasAny = true;
            }
        });

        if (hasAny) {
            sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(captured));
            setUtmData(captured);
        }
    }, []);

    return utmData;
}

/**
 * Build a query string from UTM data for redirect URLs.
 */
export function utmToQueryString(utmData) {
    const entries = Object.entries(utmData || {}).filter(([, v]) => v);
    if (entries.length === 0) return '';
    return '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
}
