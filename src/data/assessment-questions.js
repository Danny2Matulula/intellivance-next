/**
 * AI Readiness Assessment — Questions & Scoring Logic
 * 
 * Categories scored (0-25 each, 100 total):
 *   1. Process Automation Readiness
 *   2. Tech Stack Efficiency
 *   3. Manual Work Dependency
 *   4. Scalability Risk
 */

export const CATEGORIES = {
    AUTOMATION: { key: 'automation', label: 'Process Automation Readiness', maxScore: 25 },
    TECH_STACK: { key: 'techStack', label: 'Tech Stack Efficiency', maxScore: 25 },
    MANUAL_WORK: { key: 'manualWork', label: 'Manual Work Dependency', maxScore: 25 },
    SCALABILITY: { key: 'scalability', label: 'Scalability Risk', maxScore: 25 },
};

export const QUESTIONS = [
    {
        id: 'q1',
        question: 'How does your team handle repetitive daily tasks?',
        subtitle: 'Think: follow-ups, data entry, scheduling, invoicing.',
        options: [
            {
                label: 'Everything is manual — we do it all by hand',
                value: 'all_manual',
                scores: { automation: 5, manualWork: 5, scalability: 5 },
            },
            {
                label: 'We use some tools but still do most things manually',
                value: 'some_tools',
                scores: { automation: 10, manualWork: 12, scalability: 10 },
            },
            {
                label: 'Most routine tasks are handled by software or automations',
                value: 'mostly_automated',
                scores: { automation: 18, manualWork: 20, scalability: 18 },
            },
            {
                label: 'Fully automated — we rarely touch repetitive work',
                value: 'fully_automated',
                scores: { automation: 25, manualWork: 25, scalability: 23 },
            },
        ],
    },
    {
        id: 'q2',
        question: 'How many different software tools does your team use daily?',
        subtitle: 'Email, CRM, spreadsheets, invoicing, project management, etc.',
        options: [
            {
                label: '1-2 tools (mostly email and spreadsheets)',
                value: '1_2',
                scores: { techStack: 8, automation: 5 },
            },
            {
                label: '3-5 tools (some specialized, some overlap)',
                value: '3_5',
                scores: { techStack: 14, automation: 10 },
            },
            {
                label: '6-10 tools (most are connected or integrated)',
                value: '6_10',
                scores: { techStack: 22, automation: 18 },
            },
            {
                label: '10+ tools (but they don\'t talk to each other)',
                value: '10_plus_disconnected',
                scores: { techStack: 10, automation: 8 },
            },
            {
                label: '10+ tools (well integrated, data flows between them)',
                value: '10_plus_integrated',
                scores: { techStack: 25, automation: 22 },
            },
        ],
    },
    {
        id: 'q3',
        question: 'When a new lead comes in, what happens next?',
        subtitle: 'From first contact to follow-up — what does the process look like?',
        options: [
            {
                label: 'Someone has to manually check and respond',
                value: 'manual_response',
                scores: { automation: 5, scalability: 5, manualWork: 5 },
            },
            {
                label: 'We get a notification, but follow-up is manual',
                value: 'notified_manual',
                scores: { automation: 10, scalability: 10, manualWork: 10 },
            },
            {
                label: 'Auto-reply goes out, then someone takes over',
                value: 'auto_reply',
                scores: { automation: 16, scalability: 15, manualWork: 16 },
            },
            {
                label: 'Fully automated — CRM tags, emails, and tasks are created instantly',
                value: 'fully_automated',
                scores: { automation: 25, scalability: 22, manualWork: 22 },
            },
        ],
    },
    {
        id: 'q4',
        question: 'How do you currently track business performance?',
        subtitle: 'Revenue, leads, conversion rates, team productivity.',
        options: [
            {
                label: 'We don\'t really track it — we go by gut feel',
                value: 'no_tracking',
                scores: { techStack: 5, scalability: 5 },
            },
            {
                label: 'Spreadsheets and manual reports',
                value: 'spreadsheets',
                scores: { techStack: 10, scalability: 10 },
            },
            {
                label: 'We have dashboards but they\'re not always up to date',
                value: 'stale_dashboards',
                scores: { techStack: 16, scalability: 15 },
            },
            {
                label: 'Real-time dashboards that auto-update with live data',
                value: 'realtime',
                scores: { techStack: 25, scalability: 23 },
            },
        ],
    },
    {
        id: 'q5',
        question: 'If your business doubled in size tomorrow, what would break first?',
        subtitle: 'Be honest — what\'s the bottleneck?',
        options: [
            {
                label: 'Everything — we can barely handle current volume',
                value: 'everything',
                scores: { scalability: 5, manualWork: 5, automation: 5 },
            },
            {
                label: 'Customer service / communication would fall behind',
                value: 'customer_service',
                scores: { scalability: 10, manualWork: 12, automation: 10 },
            },
            {
                label: 'Internal operations — we\'d need to hire before we could scale',
                value: 'operations',
                scores: { scalability: 12, manualWork: 10, automation: 12 },
            },
            {
                label: 'We could handle it — our systems are built to scale',
                value: 'ready_to_scale',
                scores: { scalability: 25, manualWork: 22, automation: 22 },
            },
        ],
    },
    {
        id: 'q6',
        question: 'How much time does your team spend per week on work that feels like it "should be automated"?',
        subtitle: 'Data entry, copy-pasting between tools, manual follow-ups, report building.',
        options: [
            {
                label: '20+ hours per week',
                value: '20_plus',
                scores: { manualWork: 5, automation: 5 },
            },
            {
                label: '10-20 hours per week',
                value: '10_20',
                scores: { manualWork: 10, automation: 10 },
            },
            {
                label: '5-10 hours per week',
                value: '5_10',
                scores: { manualWork: 18, automation: 16 },
            },
            {
                label: 'Less than 5 hours — most of it is already automated',
                value: 'less_5',
                scores: { manualWork: 25, automation: 23 },
            },
        ],
    },
];

/**
 * Score an assessment's answers
 * @param {Object} answers - Map of question ID to selected option value
 * @returns {Object} Scoring results
 */
export function scoreAssessment(answers) {
    const categoryTotals = {
        automation: { score: 0, count: 0 },
        techStack: { score: 0, count: 0 },
        manualWork: { score: 0, count: 0 },
        scalability: { score: 0, count: 0 },
    };

    // Tally scores from selected answers
    for (const question of QUESTIONS) {
        const selectedValue = answers[question.id];
        if (!selectedValue) continue;

        const selectedOption = question.options.find(o => o.value === selectedValue);
        if (!selectedOption) continue;

        for (const [category, points] of Object.entries(selectedOption.scores)) {
            if (categoryTotals[category] !== undefined) {
                categoryTotals[category].score += points;
                categoryTotals[category].count += 1;
            }
        }
    }

    // Average each category (each question contributes 0-25 for a category)
    // Take the average across all questions that touched that category
    const categories = {};
    let totalScore = 0;

    for (const [key, data] of Object.entries(categoryTotals)) {
        const avgScore = data.count > 0 ? Math.round(data.score / data.count) : 0;
        const capped = Math.min(avgScore, 25);
        categories[key] = capped;
        totalScore += capped;
    }

    // Generate rating per category
    const ratings = {};
    for (const [key, score] of Object.entries(categories)) {
        if (score >= 20) ratings[key] = { level: 'strong', color: '#22c55e', label: 'Strong' };
        else if (score >= 13) ratings[key] = { level: 'moderate', color: '#f59e0b', label: 'Needs Work' };
        else ratings[key] = { level: 'critical', color: '#ef4444', label: 'Critical' };
    }

    // Generate recommendations for weak categories
    const recommendations = generateRecommendations(categories, ratings);

    return {
        totalScore,
        maxScore: 100,
        categories,
        ratings,
        recommendations,
        overallRating: totalScore >= 80 ? 'Excellent' :
            totalScore >= 60 ? 'Good' :
                totalScore >= 40 ? 'Needs Improvement' :
                    'Critical — Immediate Action Needed',
    };
}

function generateRecommendations(categories, ratings) {
    const recs = {};

    if (ratings.automation?.level !== 'strong') {
        recs.automation = [
            'Map your top 5 most repetitive tasks and evaluate which can be triggered automatically',
            'Consider implementing workflow automation (Zapier, Make, or custom integrations) for lead follow-up',
            'Audit your current tools for built-in automation features you may not be using',
        ];
    }

    if (ratings.techStack?.level !== 'strong') {
        recs.techStack = [
            'Consolidate overlapping tools — you may be paying for 3 tools that one platform handles',
            'Ensure your tools are connected via API integrations or middleware (Zapier, Make)',
            'Evaluate whether your current CRM is serving you or just storing data',
        ];
    }

    if (ratings.manualWork?.level !== 'strong') {
        recs.manualWork = [
            'Implement AI-assisted data entry and document processing to recover 10+ hours/week',
            'Set up automated reporting so your team stops building spreadsheets manually',
            'Introduce templated responses and AI-drafted communications for routine outreach',
        ];
    }

    if (ratings.scalability?.level !== 'strong') {
        recs.scalability = [
            'Identify your #1 bottleneck if volume doubled — that\'s where automation ROI is highest',
            'Build standard operating procedures (SOPs) for your core processes before scaling',
            'Consider AI-powered customer communication to handle increased volume without hiring',
        ];
    }

    return recs;
}

/**
 * Get a human-friendly summary paragraph based on the score
 */
export function getScoreSummary(totalScore, firstName) {
    const name = firstName || 'your business';

    if (totalScore >= 80) {
        return `${name} is operating at a high level of efficiency. Your systems are well-integrated and your team is spending most of their time on high-value work. There are still opportunities to optimize, but you're ahead of 90% of businesses we assess.`;
    } else if (totalScore >= 60) {
        return `${name} has a solid foundation, but there are clear gaps where manual work and disconnected systems are costing you time and money. The good news: the fixes are straightforward and the ROI is fast. Implementing the recommendations below could recover 10-15 hours per week for your team.`;
    } else if (totalScore >= 40) {
        return `${name} is leaving significant time and revenue on the table. Your team is doing work that should be automated, your tools aren't connected, and your ability to scale is limited by manual bottlenecks. The recommendations below target the highest-impact fixes first.`;
    } else {
        return `${name} has critical operational gaps that are actively costing you leads, revenue, and team bandwidth. Almost every core process has room for automation, and the current setup won't support growth. We strongly recommend addressing the items below as a priority — the ROI on fixing these is immediate.`;
    }
}
