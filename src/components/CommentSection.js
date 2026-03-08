"use client";

export default function CommentSection({ comments }) {
    if (!comments || comments.length === 0) return null;

    const topLevel = comments.filter(c => !c.replyTo);
    topLevel.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const repliesByParent = {};
    comments.filter(c => c.replyTo).forEach(c => {
        if (!repliesByParent[c.replyTo]) repliesByParent[c.replyTo] = [];
        repliesByParent[c.replyTo].push(c);
    });
    Object.values(repliesByParent).forEach(arr => arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));

    const openLogin = () => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('open-login-modal'));
        }
    };

    const isTeamMember = (author) => {
        const teamNames = ['Danny Matulula', 'Tyler Seton', 'Kash Maheshwari', 'Michael Foster'];
        return teamNames.some(name => author.includes(name)) || author.includes('Intellivance');
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date('2026-03-04T09:00:00.000Z');
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days < 1) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days}d ago`;
        if (days < 30) return `${Math.floor(days / 7)}w ago`;

        return date.toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric"
        });
    };

    const renderComment = (comment, isReply = false) => {
        const team = isTeamMember(comment.author);

        return (
            <div key={comment.id} className="group">
                <div className="flex gap-3">
                    {/* Avatar */}
                    <div
                        className={`
                            ${isReply ? 'w-7 h-7 text-[8px]' : 'w-9 h-9 text-[10px]'}
                            flex-shrink-0 flex items-center justify-center font-bold mt-0.5
                            ${team
                                ? 'bg-neutral-900 text-white border border-neutral-900'
                                : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                            }
                        `}
                    >
                        {comment.author.split(" ").map(n => n.charAt(0).toUpperCase()).join("").substring(0, 2)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className={`text-sm font-medium ${team ? 'text-neutral-900' : 'text-neutral-700'}`}>
                                {comment.author}
                            </span>
                            {team && (
                                <span className="mono text-[8px] px-1.5 py-0.5 bg-neutral-900 text-white uppercase tracking-wider">
                                    Team
                                </span>
                            )}
                            <span className="mono text-[10px] text-neutral-400">
                                {formatDate(comment.createdAt)}
                            </span>
                        </div>
                        <p className={`text-neutral-600 leading-relaxed ${isReply ? 'text-[13px]' : 'text-sm'}`}>
                            {comment.content}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="py-12 px-6 lg:px-12 bg-[#FAFAF8] border-t border-theme">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-medium">
                        Discussion
                        <span className="ml-2 mono text-[11px] text-neutral-400 font-normal">
                            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                        </span>
                    </h3>
                </div>

                {/* Comments */}
                <div className="space-y-0">
                    {topLevel.map((comment, idx) => (
                        <div key={comment.id}>
                            {/* Top-level comment */}
                            <div className={`py-5 ${idx !== 0 ? 'border-t border-neutral-200' : ''}`}>
                                {renderComment(comment, false)}
                            </div>

                            {/* Threaded replies */}
                            {repliesByParent[comment.id] && repliesByParent[comment.id].length > 0 && (
                                <div className="ml-5 pl-5 border-l-2 border-neutral-300 mb-2">
                                    {repliesByParent[comment.id].map((reply, rIdx) => (
                                        <div
                                            key={reply.id}
                                            className={`py-3 ${rIdx !== 0 ? 'border-t border-neutral-100' : ''}`}
                                        >
                                            {renderComment(reply, true)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Comment Input */}
                <div className="mt-10 pt-8 border-t border-neutral-300">
                    <h4 className="font-medium mb-4 text-sm">Leave a comment</h4>
                    <div className="bg-white border border-neutral-200 p-4">
                        <textarea
                            className="w-full bg-transparent border-none resize-none h-20 text-sm placeholder:text-neutral-400 focus:outline-none"
                            placeholder="Add to the discussion..."
                        ></textarea>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-100">
                            <button
                                onClick={openLogin}
                                className="mono text-[10px] text-neutral-400 uppercase tracking-widest hover:text-neutral-900 transition-colors cursor-pointer"
                            >
                                Sign in to comment
                            </button>
                            <button
                                onClick={openLogin}
                                className="bg-neutral-900 text-white px-4 py-2 mono text-[10px] uppercase tracking-wider hover:bg-black transition-colors"
                            >
                                Post Comment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
