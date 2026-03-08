const fs = require('fs');

const dataPath = 'src/data/blog-posts.json';
let posts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Read the rewritten content
const draft = fs.readFileSync('draft_rewrites.md', 'utf8');
const blocks = draft.split('---');

// Update content for first 5 posts
for (let i = 1; i <= 5; i++) {
    const afterMatch = blocks[i].match(/### AFTER \(Humanized Rewrite\)\n\n([\s\S]*?)(\n\n## |$)/);
    if (afterMatch) {
        posts[i - 1].content = afterMatch[1].trim();
    } else {
        // try fallback match
        const fallback = blocks[i].match(/### AFTER \(Humanized Rewrite\)\n\n([\s\S]*)/);
        if (fallback) {
            posts[i - 1].content = fallback[1].trim();
        }
    }
}

// Rewrite comments for Post 1
posts[0].comments = [
    {
        "id": "comment-5-signs-1",
        "author": "Marcus V.",
        "content": "Spot on. Inbox as a task manager is the trap. We actually hired an admin just to route emails before realizing we could drop an AI layer in front of the inbox. Saved a full salary.",
        "createdAt": "2025-10-15T10:23:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-5-signs-2",
        "author": "Danny Matulula",
        "content": "@Marcus V. — Exactly. People throw payroll at a problem that software already solved five years ago. Glad you guys caught it.",
        "createdAt": "2025-10-25T11:45:00.000Z",
        "replyTo": "comment-5-signs-1"
    },
    {
        "id": "comment-5-signs-3",
        "author": "Sarah Miller",
        "content": "The bit about becoming the bottleneck hit me right in the chest. I approve things without even reading them half the time anyway. Might as well let the system do it.",
        "createdAt": "2025-11-04T15:12:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-5-signs-4",
        "author": "Elena R.",
        "content": "What's the best way to handle the reporting switch? We've got managers who literally refuse to look at anything that isn't a custom-built spreadsheet.",
        "createdAt": "2025-11-14T09:30:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-5-signs-5",
        "author": "Kash Maheshwari (Intellivance)",
        "content": "@Elena — Don't fight them on format. Build a dashboard that auto-exports to their exact spreadsheet layout on a schedule. Meet them where they are, just remove the manual work of getting there.",
        "createdAt": "2025-11-24T14:20:00.000Z",
        "replyTo": "comment-5-signs-4"
    },
    {
        "id": "comment-5-signs-6",
        "author": "T. Nguyen",
        "content": "Curious if you guys handle the process mapping before the build? Because every time we try to automate, we realize our actual process is a completely undocumented mess.",
        "createdAt": "2025-12-04T16:55:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-5-signs-7",
        "author": "Danny Matulula",
        "content": "@T. Nguyen — Yes. Automating chaos just gets you faster chaos. First step is always standardizing the flow, then we engineer the automation.",
        "createdAt": "2025-12-14T10:11:00.000Z",
        "replyTo": "comment-5-signs-6"
    },
    {
        "id": "comment-5-signs-8",
        "author": "James Kowalski",
        "content": "Sent this to my co-founder. We're guilty of all five. Need to get out of the weeds.",
        "createdAt": "2025-12-24T22:40:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-5-signs-9",
        "author": "Olivia T.",
        "content": "Point 5 is brutal. Paying humans to do robot work is the quickest way to kill your margins.",
        "createdAt": "2026-01-04T08:15:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-5-signs-10",
        "author": "C. Davis",
        "content": "Just booked an assessment. If we can get back even half the time we're burning on quote follow-ups, it'll pay for itself.",
        "createdAt": "2026-01-14T14:38:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-5-signs-11",
        "author": "Ben W.",
        "content": "How do you handle edge cases in automated approvals? Sometimes an order under $500 still has weird terms that need a human eye.",
        "createdAt": "2026-01-24T19:05:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-5-signs-12",
        "author": "Tyler Seton (Intellivance)",
        "content": "@Ben — We build exception triggers. Auto-approve everything under $500 UNLESS it contains specific keywords, flags, or non-standard terms. Those drop into a manual review queue. You still cut out 90% of the noise.",
        "createdAt": "2026-02-03T21:10:00.000Z",
        "replyTo": "comment-5-signs-11"
    },
    {
        "id": "comment-5-signs-13",
        "author": "Dave L.",
        "content": "The mental load of managing the inbox alone... I didn't realize how much it was draining me until we read this.",
        "createdAt": "2026-02-13T11:22:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-5-signs-14",
        "author": "Alison B.",
        "content": "Great breakdown. We're definitely hitting the ceiling with manual follow-ups.",
        "createdAt": "2026-02-23T16:50:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-5-signs-15",
        "author": "G. H.",
        "content": "The part about 'reports should cost zero human time' is the dream. We're still fighting Excel every Friday.",
        "createdAt": "2026-03-03T09:14:00.000Z",
        "replyTo": null
    }
];

// Rewrite comments for Post 2
posts[1].comments = [
    {
        "id": "comment-real-cost-not-automating-1",
        "author": "Brian H.",
        "content": "The auto dealership stat isn't an exaggeration. I ran a BDC for four years. We paid three people full-time just to send 'did you get my quote?' emails. Huge waste of talent.",
        "createdAt": "2025-10-29T14:05:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-real-cost-not-automating-2",
        "author": "Kash Maheshwari",
        "content": "@Brian — Right? That's what kills me. You have great people rotting away doing data entry when they could be building actual relationships.",
        "createdAt": "2025-11-08T16:30:00.000Z",
        "replyTo": "comment-real-cost-not-automating-1"
    },
    {
        "id": "comment-real-cost-not-automating-3",
        "author": "P. Gomez",
        "content": "Law firms are the worst at this. The intake purgatory is real. By the time a firm checks conflicts and gets back to a prospect, they've already hired the guy down the street.",
        "createdAt": "2025-11-18T11:15:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-real-cost-not-automating-4",
        "author": "D. Chen",
        "content": "Question on the DTC cart recovery: How aggressive do you trigger those? Because if I get an email 5 minutes after leaving a site, it feels creepy.",
        "createdAt": "2025-11-28T09:40:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-real-cost-not-automating-5",
        "author": "Danny Matulula",
        "content": "@D. Chen — It depends on the ticket size. High-ticket items get a softer nudge later. Impulse buys get hit faster. We usually find the sweet spot is around 20-30 minutes. It's not creepy if you frame it right.",
        "createdAt": "2025-12-08T10:20:00.000Z",
        "replyTo": "comment-real-cost-not-automating-4"
    },
    {
        "id": "comment-real-cost-not-automating-6",
        "author": "Mark S.",
        "content": "Those HVAC no-show numbers. Wow. We lose a minimum of $4k a month just from driving to houses where nobody's home.",
        "createdAt": "2025-12-18T18:55:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-real-cost-not-automating-7",
        "author": "L. Richards",
        "content": "We run a small medical spa and the follow-up gap is our biggest leak. We just don't have the staff to text everyone manually after a session.",
        "createdAt": "2025-12-28T13:10:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-real-cost-not-automating-8",
        "author": "Michael Foster (Intellivance)",
        "content": "@L. Richards — That's the beauty of it. You don't need the staff. The system grabs the booking data and fires the text. Let the software do the heavy lifting.",
        "createdAt": "2026-01-07T14:45:00.000Z",
        "replyTo": "comment-real-cost-not-automating-7"
    },
    {
        "id": "comment-real-cost-not-automating-9",
        "author": "Aaron C.",
        "content": "This breakdown makes it so clear. It's not just about 'saving time' — it's about plugging revenue leaks.",
        "createdAt": "2026-01-17T09:30:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-real-cost-not-automating-10",
        "author": "T. Wallace",
        "content": "Field service scheduling is a nightmare. Our goal this quarter is to get a handle on route optimization.",
        "createdAt": "2026-01-27T16:05:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-real-cost-not-automating-11",
        "author": "J. Kim",
        "content": "The fact that people are still managing commission disbursements in Excel in 2026 blows my mind.",
        "createdAt": "2026-02-06T11:50:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-real-cost-not-automating-12",
        "author": "Kevin R.",
        "content": "Good post. The opportunity cost of bad systems is way worse than the SaaS fees.",
        "createdAt": "2026-02-16T15:20:00.000Z",
        "replyTo": null
    }
];

// Rewrite comments for Post 3
posts[2].comments = [
    {
        "id": "comment-how-we-saved-medical-practice-11-hours-per-week-1",
        "author": "Monica T.",
        "content": "How do front desk staff usually react? Do they feel like they're being replaced, or are they honestly relieved?",
        "createdAt": "2025-11-18T13:40:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-how-we-saved-medical-practice-11-hours-per-week-2",
        "author": "Danny Matulula",
        "content": "@Monica — They love it. We frame it as taking the robot work off their plate so they can focus on the actual humans standing in front of them. Front desk staff hate making awkward 40 follow-up calls.",
        "createdAt": "2025-11-28T13:19:00.000Z",
        "replyTo": "comment-how-we-saved-medical-practice-11-hours-per-week-1"
    },
    {
        "id": "comment-how-we-saved-medical-practice-11-hours-per-week-3",
        "author": "S. Williams",
        "content": "Doubling rebookings is wild. People just forget if you don't nudge them at the exact right second. Automation is the only way to get that consistent.",
        "createdAt": "2025-12-08T19:36:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-how-we-saved-medical-practice-11-hours-per-week-4",
        "author": "Kevin Tran",
        "content": "+325% on Google reviews. Your local SEO must be flying. What's the sweet spot for the text? Right after they walk out the door?",
        "createdAt": "2025-12-21T13:57:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-how-we-saved-medical-practice-11-hours-per-week-5",
        "author": "Michael Foster (Intellivance)",
        "content": "@Kevin — Two hours post-appointment, via SMS. Same-day keeps it fresh, but two hours gives them a minute to breathe. We tested a bunch, that's the winner.",
        "createdAt": "2025-12-31T20:44:00.000Z",
        "replyTo": "comment-how-we-saved-medical-practice-11-hours-per-week-4"
    },
    {
        "id": "comment-how-we-saved-medical-practice-11-hours-per-week-6",
        "author": "Lauren C.",
        "content": "Did you rip and replace their software to pull this off, or just plug into what they had?",
        "createdAt": "2026-01-10T23:19:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-how-we-saved-medical-practice-11-hours-per-week-7",
        "author": "Danny Matulula",
        "content": "@Lauren — Plugged right in via API. We don't force staff to learn a bunch of new software. The magic happens seamlessly behind their existing EHR.",
        "createdAt": "2026-01-21T15:30:00.000Z",
        "replyTo": "comment-how-we-saved-medical-practice-11-hours-per-week-6"
    },
    {
        "id": "comment-how-we-saved-medical-practice-11-hours-per-week-8",
        "author": "Jason B.",
        "content": "Just booked an assessment. We’ve got 6 dental locations and I know for a fact we're bleeding money on no-shows.",
        "createdAt": "2026-02-02T13:10:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-how-we-saved-medical-practice-11-hours-per-week-9",
        "author": "R. Okonkwo",
        "content": "The fact that one front desk was trying to manually run review sequences across 4 spots is terrifying. Math makes this a no-brainer.",
        "createdAt": "2026-02-12T14:52:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-how-we-saved-medical-practice-11-hours-per-week-10",
        "author": "Anna-Marie K.",
        "content": "Sent this to my multi-practice owner group. This is the exact proof we needed to validate switching from spreadsheet chaos to automated flows.",
        "createdAt": "2026-02-23T14:41:00.000Z",
        "replyTo": null
    }
];

// Rewrite comments for Post 4
posts[3].comments = [
    {
        "id": "comment-automation-roi-calculator-1",
        "author": "Nate Archibald",
        "content": "Layer 2 just hit me. Everyone fixates on time saved, and totally ignores the revenue they protect from dropped balls. Great reframe.",
        "createdAt": "2025-11-22T15:25:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-automation-roi-calculator-2",
        "author": "Chris Traeger",
        "content": "Sent this straight to the CFO. We needed numbers to justify the build, and this equation is exactly it.",
        "createdAt": "2025-12-04T17:40:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-automation-roi-calculator-3",
        "author": "Amanda L.",
        "content": "The stat about response time dropping by 400% after 30 minutes hurts to read. It's so true. Speed to lead changes everything.",
        "createdAt": "2025-12-19T20:33:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-automation-roi-calculator-4",
        "author": "Ryan S.",
        "content": "Are you guys hitting that $100k ROI with mostly mid-market companies or SMBs?",
        "createdAt": "2025-12-31T16:30:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-automation-roi-calculator-5",
        "author": "Tyler Seton",
        "content": "@Ryan — Those numbers track heavily in the $1M-$10M revenue band. Even if you're a $500K shop, the multiplier still swings wildly in your favor.",
        "createdAt": "2026-01-14T20:56:00.000Z",
        "replyTo": "comment-automation-roi-calculator-4"
    },
    {
        "id": "comment-automation-roi-calculator-6",
        "author": "Oliver Queen",
        "content": "Growth capacity is the actual cheat code here. Free up your smart people from doing dumb admin work and watch what happens to your pipeline.",
        "createdAt": "2026-01-28T22:13:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-automation-roi-calculator-7",
        "author": "Paula Teixeira",
        "content": "I ran your math. We're bleeding about $180K a year on stuff I didn't even put a price tag on before—missed callbacks, sloppy scheduling. A complete eye-opener.",
        "createdAt": "2026-02-12T02:46:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-automation-roi-calculator-8",
        "author": "Derek F.",
        "content": "Finally, an ROI framework that factors in opportunity cost instead of just labor reduction. That's the part the CFO actually cares about.",
        "createdAt": "2026-02-24T13:09:00.000Z",
        "replyTo": null
    }
];

// Rewrite comments for Post 5
posts[4].comments = [
    {
        "id": "comment-operators-guide-to-ai-readiness-1",
        "author": "TechFounder22",
        "content": "'You can't automate chaos.' I am literally printing that out. Best take on AI readiness I've seen in months.",
        "createdAt": "2025-12-05T21:01:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-operators-guide-to-ai-readiness-2",
        "author": "Samantha Jones",
        "content": "I completely blew this up last year. Tried to build predictive scoring, but our CRM data was trash. It was a spectacular failure. Should've read this.",
        "createdAt": "2025-12-25T15:41:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-operators-guide-to-ai-readiness-3",
        "author": "Victor D.",
        "content": "The warning signs at the end hit hard. People want an AI fix for terrible leadership or sloppy processes. Software doesn't fix a broken culture.",
        "createdAt": "2026-01-16T14:58:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-operators-guide-to-ai-readiness-4",
        "author": "Leslie Knope",
        "content": "What's the play if 80% of our workflow is still paper forms? Where do we even begin?",
        "createdAt": "2026-02-05T13:23:00.000Z",
        "replyTo": null
    },
    {
        "id": "comment-operators-guide-to-ai-readiness-5",
        "author": "Danny Matulula",
        "content": "@Leslie — Grab a digital shovel. Get a unified CRM and force the team into a digital workflow first. Forget AI exists until the digital habits stick. Otherwise you're building on raw sand.",
        "createdAt": "2026-02-26T02:06:00.000Z",
        "replyTo": "comment-operators-guide-to-ai-readiness-4"
    }
];


fs.writeFileSync(dataPath, JSON.stringify(posts, null, 2));
console.log('Posts 1-5 and their comments updated.');
