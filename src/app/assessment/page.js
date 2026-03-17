"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Shield, Mail, Download } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUTM, utmToQueryString } from '@/hooks/useUTM';
import { QUESTIONS, scoreAssessment, getScoreSummary } from '@/data/assessment-questions';

// --- Token / Session Management ---
const TOKEN_KEY = 'intellivance_assessment_token';
const DATA_KEY = 'intellivance_assessment_data';

const generateToken = () => {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
};

const saveSession = (token, data) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
};

const loadSession = (tokenFromUrl) => {
    const storedToken = tokenFromUrl || localStorage.getItem(TOKEN_KEY);
    if (!storedToken) return null;
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return null;
    try {
        const data = JSON.parse(raw);
        if (data.token === storedToken) return data;
    } catch { /* corrupted */ }
    return null;
};

const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(DATA_KEY);
};

const TOTAL_STEPS = 3;

export default function AssessmentPage() {
    const [step, setStep] = useState(1);
    const [token, setToken] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [honeypot, setHoneypot] = useState('');
    const [scoreResults, setScoreResults] = useState(null);
    const [downloadingPDF, setDownloadingPDF] = useState(false);
    const [emailError, setEmailError] = useState('');
    const utmData = useUTM();

    // --- Business email validation ---
    const PERSONAL_DOMAINS = new Set([
        'gmail.com', 'yahoo.com', 'yahoo.co.uk', 'hotmail.com', 'hotmail.co.uk',
        'outlook.com', 'live.com', 'msn.com', 'aol.com', 'icloud.com', 'me.com',
        'mac.com', 'protonmail.com', 'proton.me', 'mail.com', 'zoho.com',
        'ymail.com', 'gmx.com', 'gmx.net', 'inbox.com', 'fastmail.com',
        'rocketmail.com', 'att.net', 'sbcglobal.net', 'comcast.net',
        'verizon.net', 'cox.net', 'charter.net', 'earthlink.net',
    ]);

    const isBusinessEmail = (email) => {
        if (!email || !email.includes('@')) return true;
        const domain = email.split('@')[1]?.toLowerCase()?.trim();
        if (!domain || !domain.includes('.')) return true;
        return !PERSONAL_DOMAINS.has(domain);
    };

    // --- Conversion Tracking ---
    const fireEvent = (eventName, params = {}) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', eventName, params);
        }
        if (typeof window !== 'undefined' && window.uetq) {
            window.uetq.push('event', eventName, params);
        }
    };

    const validateEmail = (email) => {
        if (!email.includes('@') || !email.includes('.')) return false;
        if (!isBusinessEmail(email)) {
            setEmailError('Please use your business email — we tailor your report to your company.');
            return false;
        }
        setEmailError('');
        return true;
    };

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        // Scored answers
        q1: '', q2: '', q3: '', q4: '', q5: '', q6: '',
    });

    useEffect(() => {
        // Scroll to top on mount so form is always visible
        window.scrollTo(0, 0);

        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token');
        const session = loadSession(urlToken);
        if (session) {
            // Guard: if session saved at step 3 but has no score data, reset
            if (session.currentStep === 3 && !session.scoreResults) {
                clearSession();
                return; // Start fresh
            }
            setToken(session.token);
            setFormData(session.formData);
            setStep(session.currentStep);
            if (session.scoreResults) setScoreResults(session.scoreResults);
        }
    }, []);

    useEffect(() => {
        if (token && step > 1) {
            saveSession(token, { token, formData, currentStep: step, scoreResults, updatedAt: new Date().toISOString() });
        }
    }, [step, formData, token, scoreResults]);

    const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const initSession = () => {
        const newToken = generateToken();
        setToken(newToken);
        saveSession(newToken, { token: newToken, formData, currentStep: 1, updatedAt: new Date().toISOString() });
    };

    const syncWithBackend = async (isCompleted = false) => {
        if (!token && !isCompleted) return null;
        try {
            const res = await fetch('/api/submit-assessment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: token || generateToken(),
                    formData,
                    step: isCompleted ? TOTAL_STEPS : step,
                    completed: isCompleted,
                    honeypot,
                    utmData,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                return data.contactId || null;
            }
        } catch (e) {
            console.error('Sync failed', e);
        }
        return null;
    };

    const computeScore = useCallback(() => {
        const answers = { q1: formData.q1, q2: formData.q2, q3: formData.q3, q4: formData.q4, q5: formData.q5, q6: formData.q6 };
        const results = scoreAssessment(answers);
        setScoreResults(results);
        fireEvent('score_revealed', { event_category: 'assessment', event_label: results.overallRating, value: results.totalScore });
        return results;
    }, [formData.q1, formData.q2, formData.q3, formData.q4, formData.q5, formData.q6]);

    const goNext = () => {
        if (!token) initSession();

        if (step === 1) {
            if (!validateEmail(formData.email)) return;
            syncWithBackend(false);
            fireEvent('generate_lead', { event_category: 'assessment', event_label: 'email_captured', value: 1 });
        }

        if (step === 2) {
            // Compute score, show processing, then reveal
            computeScore();
            setProcessing(true);
            setTimeout(async () => {
                setProcessing(false);
                const cId = await syncWithBackend(true);
                // Trigger report email in background
                try {
                    const answers = { q1: formData.q1, q2: formData.q2, q3: formData.q3, q4: formData.q4, q5: formData.q5, q6: formData.q6 };
                    fetch('/api/generate-report', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ answers, firstName: formData.firstName, email: formData.email, contactId: cId, returnPDF: false }),
                    }).catch(e => console.error('Report email error:', e));
                } catch (e) {
                    console.error('Report trigger error:', e);
                }
                setStep(3);
            }, 3000);
            return;
        }

        if (step < TOTAL_STEPS) setStep(prev => prev + 1);
    };

    const goBack = () => {
        if (step > 1) setStep(prev => prev - 1);
    };

    const handleDownloadPDF = async () => {
        setDownloadingPDF(true);
        try {
            const answers = { q1: formData.q1, q2: formData.q2, q3: formData.q3, q4: formData.q4, q5: formData.q5, q6: formData.q6 };
            const res = await fetch('/api/generate-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers, firstName: formData.firstName, email: formData.email, returnPDF: true }),
            });
            if (!res.ok) throw new Error('PDF generation failed');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Intellivance_AI_Readiness_Scorecard.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            fireEvent('pdf_download', { event_category: 'assessment', event_label: 'scorecard_pdf' });
        } catch (e) {
            console.error('PDF download error:', e);
        } finally {
            setDownloadingPDF(false);
        }
    };

    const progress = Math.round((step / TOTAL_STEPS) * 100);

    const canProceed = () => {
        switch (step) {
            case 1: return formData.email.includes('@') && formData.email.includes('.') && formData.firstName.trim().length > 0 && isBusinessEmail(formData.email);
            case 2: return formData.q1 !== '' && formData.q2 !== '' && formData.q3 !== '' && formData.q4 !== '' && formData.q5 !== '' && formData.q6 !== '';
            default: return true;
        }
    };

    const inputClass = "w-full bg-[#FAFAF8] border border-theme px-5 py-4 text-[15px] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-all";
    const labelClass = "block mono text-[10px] uppercase tracking-widest text-neutral-500 mb-3";

    const slideVariants = {
        enter: (direction) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction) => ({ x: direction < 0 ? 60 : -60, opacity: 0 }),
    };
    const [direction, setDirection] = useState(1);

    const navigateStep = (newStep) => {
        setDirection(newStep > step ? 1 : -1);
        if (newStep > step) goNext();
        else goBack();
    };

    // --- Score color helpers ---
    const getScoreColorClass = (score, max) => {
        const pct = (score / max) * 100;
        if (pct >= 80) return 'text-green-500';
        if (pct >= 52) return 'text-amber-500';
        return 'text-red-500';
    };

    const getScoreBgClass = (score, max) => {
        const pct = (score / max) * 100;
        if (pct >= 80) return 'bg-green-500';
        if (pct >= 52) return 'bg-amber-500';
        return 'bg-red-500';
    };

    const getScoreBorderClass = (score, max) => {
        const pct = (score / max) * 100;
        if (pct >= 80) return 'border-green-500';
        if (pct >= 52) return 'border-amber-500';
        return 'border-red-500';
    };

    // --- Processing Animation ---
    const renderProcessing = () => (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center py-16">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-10">
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <motion.div className="absolute inset-0 border border-neutral-300 rounded-full" animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                    <motion.div className="absolute inset-2 border border-neutral-400 rounded-full" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.1, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} />
                    <div className="absolute inset-4 border border-neutral-900 rounded-full flex items-center justify-center bg-white shadow-sm">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                            <Shield className="w-8 h-8 text-neutral-900" />
                        </motion.div>
                    </div>
                </div>
                <h3 className="text-2xl font-normal tracking-tight text-neutral-900 mb-3">Calculating your AI Readiness Score...</h3>
                <p className="text-[14px] text-neutral-500 max-w-sm mx-auto leading-relaxed">
                    Scoring your responses across 4 categories.
                </p>
                <div className="mt-8 space-y-3 text-left max-w-xs mx-auto">
                    {[
                        { label: "Analyzing responses", delay: 0 },
                        { label: "Scoring across 4 categories", delay: 0.8 },
                        { label: "Building your report", delay: 1.6 },
                    ].map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: item.delay, duration: 0.4 }} className="flex items-center gap-3">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: item.delay + 0.6, type: "spring" }}>
                                <Check className="w-3.5 h-3.5 text-neutral-900" />
                            </motion.div>
                            <span className="mono text-[10px] tracking-wider text-neutral-500 uppercase">{item.label}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );

    // --- Category labels ---
    const CATEGORY_LABELS = {
        automation: 'Process Automation',
        techStack: 'Tech Stack Efficiency',
        manualWork: 'Manual Work Dependency',
        scalability: 'Scalability Risk',
    };

    // --- Question Card ---
    const renderQuestionCard = (question, questionIndex) => {
        const selectedValue = formData[question.id];
        return (
            <div key={question.id} className="mb-6 last:mb-0">
                <label className={labelClass}>Q{questionIndex + 1} — {question.question}</label>
                {question.subtitle && (
                    <p className="text-[12px] text-neutral-500 mb-3 leading-relaxed">{question.subtitle}</p>
                )}
                <div className="grid grid-cols-1 gap-[1px] bg-theme overflow-hidden border border-theme">
                    {question.options.map((option) => (
                        <label
                            key={option.value}
                            className={`flex items-center justify-center py-3.5 px-5 bg-white cursor-pointer hover:bg-neutral-50 transition-all ${selectedValue === option.value ? 'bg-neutral-100 ring-1 ring-inset ring-neutral-900' : ''}`}
                        >
                            <input type="radio" value={option.value} checked={selectedValue === option.value} onChange={() => updateField(question.id, option.value)} className="sr-only" />
                            <span className={`text-[13px] transition-colors leading-relaxed text-center ${selectedValue === option.value ? 'text-neutral-900 font-medium' : 'text-neutral-500'}`}>
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        );
    };

    // --- Step Content ---
    const renderStepContent = () => {
        switch (step) {
            // STEP 1: Email capture
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-[#FAFAF8] border border-theme flex items-center justify-center">
                                <Mail className="w-4 h-4 text-neutral-900" />
                            </div>
                            <p className="text-[15px] font-medium text-neutral-900">Get your personalized AI Readiness Score.</p>
                        </div>
                        <p className="text-[14px] text-neutral-600 leading-relaxed">
                            6 quick questions. Instant score across 4 categories. Personalized PDF report — free.
                        </p>
                        <div>
                            <label className={labelClass}>First name</label>
                            <input type="text" value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} placeholder="First name" className={inputClass} autoFocus />
                        </div>
                        <div>
                            <label className={labelClass}>Business email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => { updateField('email', e.target.value); setEmailError(''); }}
                                onBlur={() => formData.email && validateEmail(formData.email)}
                                placeholder="you@company.com"
                                className={inputClass}
                            />
                            {emailError && (
                                <p className="text-red-500 text-[12px] mt-2">{emailError}</p>
                            )}
                            <p className="text-[11px] text-neutral-400 mt-2">We use your company domain to tailor the report. No spam, ever.</p>
                        </div>
                        {/* Honeypot */}
                        <div className="absolute -left-[9999px]" aria-hidden="true">
                            <input type="text" name="company_address" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                        </div>
                    </div>
                );

            // STEP 2: All 6 questions on one page
            case 2:
                return (
                    <div className="space-y-2">
                        {QUESTIONS.map((q, i) => renderQuestionCard(q, i))}
                    </div>
                );

            // STEP 3: Score reveal
            case 3:
                if (!scoreResults) return null;
                const { totalScore, maxScore, overallRating, categories, ratings, recommendations } = scoreResults;
                return (
                    <div className="space-y-8">
                        {/* Score circle */}
                        <div className="text-center py-4">
                            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-4 ${getScoreBorderClass(totalScore, maxScore)} mb-4`}>
                                <div className="text-center">
                                    <span className={`text-5xl font-bold tracking-tight ${getScoreColorClass(totalScore, maxScore)}`}>{totalScore}</span>
                                    <span className="text-neutral-400 text-lg block -mt-1">/{maxScore}</span>
                                </div>
                            </div>
                            <div className={`mono text-[11px] uppercase tracking-widest font-semibold ${getScoreColorClass(totalScore, maxScore)}`}>
                                {overallRating}
                            </div>
                            <p className="text-[14px] text-neutral-500 mt-3 max-w-md mx-auto leading-relaxed">
                                {getScoreSummary(totalScore, formData.firstName)}
                            </p>
                        </div>

                        {/* Category breakdown */}
                        <div>
                            <div className="mono text-[10px] text-neutral-500 uppercase tracking-widest mb-4">Category Breakdown</div>
                            <div className="space-y-0">
                                {Object.entries(categories).map(([key, score]) => {
                                    const rating = ratings[key] || {};
                                    const pct = (score / 25) * 100;
                                    return (
                                        <div key={key} className="py-3 border-t border-theme">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[13px] font-medium text-neutral-900">{CATEGORY_LABELS[key] || key}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="mono text-[11px] text-neutral-900 font-semibold">{score}/25</span>
                                                    <span className="mono text-[9px] uppercase tracking-widest font-semibold" style={{ color: rating.color || '#777' }}>
                                                        {rating.label || ''}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: rating.color || '#777' }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Top recommendations */}
                        {Object.keys(recommendations).length > 0 && (
                            <div>
                                <div className="mono text-[10px] text-neutral-500 uppercase tracking-widest mb-3">Top Recommendations</div>
                                {Object.entries(recommendations).slice(0, 2).map(([key, items]) => (
                                    <div key={key} className="mb-4">
                                        <div className="text-[12px] font-medium text-neutral-900 mb-2">{CATEGORY_LABELS[key]}</div>
                                        {items.slice(0, 2).map((item, i) => (
                                            <div key={i} className="flex gap-2 mb-1.5 pl-2">
                                                <span className="text-[12px] text-amber-600 font-bold">→</span>
                                                <span className="text-[12px] text-neutral-600 leading-relaxed">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="pt-4 space-y-3 border-t border-theme">
                            <button
                                onClick={handleDownloadPDF}
                                disabled={downloadingPDF}
                                className="w-full btn-tech group flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Download className="w-3.5 h-3.5" />
                                {downloadingPDF ? 'Generating PDF...' : 'Download Full Report (PDF)'}
                            </button>
                            <a
                                href="https://calendly.com/dan-intellivance/30min"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => fireEvent('calendly_click', { event_category: 'assessment', event_label: 'book_strategy_call', value: 1 })}
                                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all mono text-[11px] uppercase tracking-widest font-semibold text-center"
                            >
                                Book a Free Strategy Call
                                <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                            <p className="text-center text-[11px] text-neutral-400">
                                We&apos;ve automated $4.2M+ in operations. 100% client retention.
                            </p>
                        </div>
                    </div>
                );

            default: return null;
        }
    };

    const stepHeadings = {
        1: "AI Readiness Assessment",
        2: "Answer 6 quick questions.",
        3: "Your AI Readiness Score",
    };

    return (
        <div className="selection:bg-neutral-900 selection:text-white">
            <Navbar />
            <main className="pt-16 min-h-screen flex items-center justify-center px-4 sm:px-6 bg-[#EAEAE5] relative overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>
                <div className="max-w-2xl w-full relative z-10 py-8 sm:py-14 lg:py-20 min-h-0">

                    <div className="bg-white border border-theme p-5 sm:p-8 lg:p-12 shadow-sm">

                        {processing ? renderProcessing() : (
                            <>
                                {/* Progress header */}
                                {step < 3 && (
                                    <div className="mb-6 sm:mb-10">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="mono text-[10px] text-neutral-500 uppercase tracking-widest">
                                                Step {step} of {TOTAL_STEPS}
                                            </span>
                                            <span className="mono text-[10px] text-neutral-900 uppercase tracking-widest">
                                                {progress}%
                                            </span>
                                        </div>
                                        <div className="w-full h-[2px] bg-theme overflow-hidden">
                                            <motion.div className="h-full bg-neutral-900" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
                                        </div>
                                    </div>
                                )}

                                <AnimatePresence mode="wait">
                                    <motion.h3 key={`heading-${step}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="text-xl sm:text-2xl lg:text-3xl font-normal tracking-tight text-neutral-900 mb-4 sm:mb-8">
                                        {stepHeadings[step]}
                                    </motion.h3>
                                </AnimatePresence>

                                <AnimatePresence mode="wait" custom={direction}>
                                    <motion.div key={`step-${step}`} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: 'easeInOut' }}>
                                        {renderStepContent()}
                                    </motion.div>
                                </AnimatePresence>

                                {step < 3 && (
                                    <div className="flex items-center justify-between mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-theme">
                                        {step > 1 ? (
                                            <button onClick={() => navigateStep(step - 1)} className="flex items-center gap-2 mono text-[10px] text-neutral-500 uppercase tracking-widest hover:text-neutral-900 transition-colors">
                                                <ArrowLeft className="w-3.5 h-3.5" /> Back
                                            </button>
                                        ) : <div />}

                                        <button onClick={() => navigateStep(step + 1)} disabled={!canProceed()} className="btn-tech group flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
                                            {step === 1 ? 'Start Assessment' : 'Get My Score'}
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
