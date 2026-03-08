"use client";

export default function ShareBar({ title, slug }) {
    const url = `https://intellivance.ai/blog/${slug}`;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedSummary = encodeURIComponent(
        "Worth reading if you run operations for an SMB 👇"
    );

    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            const btn = document.getElementById("copy-confirm");
            if (btn) {
                btn.textContent = "COPIED";
                setTimeout(() => {
                    btn.textContent = "COPY LINK";
                }, 2000);
            }
        } catch {
            // fallback
        }
    };

    return (
        <div className="flex items-center gap-3">
            <span className="mono text-[9px] text-neutral-400 uppercase tracking-widest mr-1">
                Share
            </span>

            {/* LinkedIn */}
            <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 mono text-[10px] px-2.5 py-1.5 border border-neutral-300 text-neutral-500 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors"
                title="Share on LinkedIn"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LINKEDIN
            </a>

            {/* X / Twitter */}
            <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 mono text-[10px] px-2.5 py-1.5 border border-neutral-300 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900 transition-colors"
                title="Share on X"
            >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                POST
            </a>

            {/* Copy Link */}
            <button
                onClick={handleCopy}
                id="copy-confirm"
                className="mono text-[10px] px-2.5 py-1.5 border border-neutral-300 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900 transition-colors"
            >
                COPY LINK
            </button>
        </div>
    );
}
