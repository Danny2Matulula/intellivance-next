/**
 * Post-Deploy Smoke Test — Intellivance
 * 
 * Checks critical pages for expected DOM elements after deploy.
 * Run: node scripts/smoke-test.js
 * 
 * Exit code 0 = all pass, 1 = failures detected
 * 
 * WHY THIS EXISTS:
 * - 2026-03-10: Assessment page code was never committed, ads spent on old form
 * - 2026-03-17: Assessment page blank due to corrupted localStorage, ads spent on broken page
 */

const SITE_URL = process.env.SITE_URL || 'https://intellivance.ai';

const CHECKS = [
  {
    path: '/assessment',
    name: 'Assessment Page',
    expectedStatus: 200,
    mustContain: [
      'First name',        // Step 1 form field
      'Business email',    // Step 1 form field  
      'Start Assessment',  // CTA button
      'AI Readiness',      // Page heading
    ],
    mustNotContain: [
      'Internal Server Error',
      'Application error',
      'This page could not be found',
    ],
  },
  {
    path: '/blog/how-to-use-ai-in-your-business',
    name: 'Blog Post (Google Ads Landing)',
    expectedStatus: 200,
    mustContain: [
      'Get Your AI Readiness Score',  // Blog CTA
      'assessment',                    // Link to assessment
    ],
    mustNotContain: [
      'Internal Server Error',
      'This page could not be found',
    ],
  },
  {
    path: '/',
    name: 'Homepage',
    expectedStatus: 200,
    mustContain: [
      'Intellivance',
      'assessment',    // CTA link exists
    ],
    mustNotContain: [
      'Internal Server Error',
      'Application error',
    ],
  },
  {
    path: '/assessment/thank-you',
    name: 'Thank You Page (Conversion)',
    expectedStatus: 200,
    mustContain: [
      'thank',  // Some variation of "thank you"
    ],
    mustNotContain: [
      'Internal Server Error',
    ],
  },
];

async function runChecks() {
  let failures = 0;
  const results = [];
  console.log(`\n🔍 Smoke Testing: ${SITE_URL}`);
  console.log(`   Time: ${new Date().toISOString()}\n`);

  for (const check of CHECKS) {
    const url = `${SITE_URL}${check.path}`;
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'IntellivanceSmokeTest/1.0' },
        redirect: 'follow',
      });
      const html = await res.text();
      const issues = [];

      // Status check
      if (res.status !== check.expectedStatus) {
        issues.push(`Expected status ${check.expectedStatus}, got ${res.status}`);
      }

      // Content length sanity check (catch blank pages)
      if (html.length < 500) {
        issues.push(`Suspiciously short response: ${html.length} bytes (possible blank page)`);
      }

      // Must-contain checks (case-insensitive)
      for (const term of check.mustContain) {
        if (!html.toLowerCase().includes(term.toLowerCase())) {
          issues.push(`Missing expected content: "${term}"`);
        }
      }

      // Must-not-contain checks
      for (const term of (check.mustNotContain || [])) {
        if (html.toLowerCase().includes(term.toLowerCase())) {
          issues.push(`Found error indicator: "${term}"`);
        }
      }

      const passed = issues.length === 0;
      if (!passed) {
        console.log(`  ❌ FAIL: ${check.name} (${check.path})`);
        issues.forEach(i => console.log(`     → ${i}`));
        failures++;
      } else {
        console.log(`  ✅ PASS: ${check.name} (${check.path})`);
      }
      results.push({ name: check.name, path: check.path, passed, issues });

    } catch (err) {
      console.log(`  ❌ FAIL: ${check.name} (${check.path}) — ${err.message}`);
      failures++;
      results.push({ name: check.name, path: check.path, passed: false, issues: [err.message] });
    }
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`${failures === 0 ? '✅ All checks passed.' : `❌ ${failures} check(s) failed. DO NOT mark deploy as complete.`}`);
  console.log(`${'─'.repeat(50)}\n`);

  process.exit(failures > 0 ? 1 : 0);
}

runChecks();
