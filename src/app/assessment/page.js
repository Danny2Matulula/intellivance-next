"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Shield, Mail, Download, ChevronRight } from 'lucide-react';
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

const TOTAL_STEPS = 10;

// Question pairs for steps 3-5 (2 questions per screen)
const QUESTION_PAIRS = [
    [QUESTIONS[0], QUESTIONS[1]], // Step 3: Q1, Q2
    [QUESTIONS[2], QUESTIONS[3]], // Step 4: Q3, Q4
    [QUESTIONS[4], QUESTIONS[5]], // Step 5: Q5, Q6
];

export default function AssessmentPage() {
    const [step, setStep] = useState(1);
    const [token, setToken] = useState(null);
    const [submitted, setSubmitted] = useState(false);
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
        if (!email || !email.includes('@')) return true; // Don't show error while still typing
        const domain = email.split('@')[1]?.toLowerCase()?.trim();
        if (!domain || !domain.includes('.')) return true; // Incomplete domain, don't flag yet
        return !PERSONAL_DOMAINS.has(domain);
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
        industry: '',
        teamSize: '',
        website: '',
        weeklyWorkflow: '',
        moneyLoss: '',
        timeline: '',
        email: '',
        firstName: '',
        phone: '',
        // Scored question answers (q1-q6)
        q1: '',
        q2: '',
        q3: '',
        q4: '',
        q5: '',
        q6: '',
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token');
        const session = loadSession(urlToken);
        if (session) {
            setToken(session.token);
            setFormData(session.formData);
            setStep(session.currentStep);
            if (session.scoreResults) {
                setScoreResults(session.scoreResults);
            }
        }
    }, []);

    useEffect(() => {
        if (token && step > 1) {
            saveSession(token, {
                token,
                formData,
                currentStep: step,
                scoreResults,
                updatedAt: new Date().toISOString(),
            });
        }
    }, [step, formData, token, scoreResults]);

    const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const initSession = () => {
        const newToken = generateToken();
        setToken(newToken);
        saveSession(newToken, {
            token: newToken,
            formData,
            currentStep: 1,
            updatedAt: new Date().toISOString(),
        });
    };

    const syncWithBackend = async (isCompleted = false) => {
        if (!token && !isCompleted) return;
        try {
            await fetch('/api/submit-assessment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: token || generateToken(),
                    formData,
                    step: isCompleted ? TOTAL_STEPS : step,
                    completed: isCompleted,
                    honeypot: honeypot,
                    utmData,
                })
            });
        } catch (e) {
            console.error('Sync failed', e);
        }
    };

    const computeScore = useCallback(() => {
        const answers = {
            q1: formData.q1,
            q2: formData.q2,
            q3: formData.q3,
            q4: formData.q4,
            q5: formData.q5,
            q6: formData.q6,
        };
        const results = scoreAssessment(answers);
        setScoreResults(results);
        return results;
    }, [formData.q1, formData.q2, formData.q3, formData.q4, formData.q5, formData.q6]);

    const goNext = () => {
        if (!token) initSession();

        // Transitioning from step 5 to step 6 (processing): compute score
        if (step === 5) {
            computeScore();
            // Enter processing animation
            setProcessing(true);
            setTimeout(() => {
                setProcessing(false);
                setStep(7); // Jump to score reveal after processing
            }, 3200);
            // Set step to 6 for the processing screen
            setStep(6);
            return;
        }

        // Sync with backend after email capture (step 1)
        if (step === 1) syncWithBackend(false);

        if (step < TOTAL_STEPS) setStep(prev => prev + 1);
    };

    const goBack = () => {
        // Don't go back past step 1
        if (step <= 1) return;
        // Skip step 6 (processing) when going back
        if (step === 7) {
            setStep(5);
            return;
        }
        setStep(prev => prev - 1);
    };

    const handleFinalSubmit = async () => {
        setProcessing(true);
        await syncWithBackend(true);

        // Trigger PDF email in background
        try {
            const answers = { q1: formData.q1, q2: formData.q2, q3: formData.q3, q4: formData.q4, q5: formData.q5, q6: formData.q6 };
            fetch('/api/generate-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers,
                    firstName: formData.firstName,
                    email: formData.email,
                    returnPDF: false,
                }),
            }).catch(e => console.error('Report email error:', e));
        } catch (e) {
            console.error('Report trigger error:', e);
        }

        setTimeout(() => {
            clearSession();
            window.location.href = '/assessment/thank-you' + utmToQueryString(utmData);
        }, 800);
    };

    // Handle "Submit now" from score reveal (skip optional steps)
    const handleEarlySubmit = async () => {
        setProcessing(true);
        await syncWithBackend(true);

        try {
            const answers = { q1: formData.q1, q2: formData.q2, q3: formData.q3, q4: formData.q4, q5: formData.q5, q6: formData.q6 };
            fetch('/api/generate-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers,
                    firstName: formData.firstName,
                    email: formData.email,
                    returnPDF: false,
                }),
            }).catch(e => console.error('Report email error:', e));
        } catch (e) {
            console.error('Report trigger error:', e);
        }

        setTimeout(() => {
            clearSession();
            window.location.href = '/assessment/thank-you' + utmToQueryString(utmData);
        }, 800);
    };

    const handleDownloadPDF = async () => {
        setDownloadingPDF(true);
        try {
            const answers = { q1: formData.q1, q2: formData.q2, q3: formData.q3, q4: formData.q4, q5: formData.q5, q6: formData.q6 };
            const res = await fetch('/api/generate-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers,
                    firstName: formData.firstName,
                    email: formData.email,
                    returnPDF: true,
                }),
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
        } catch (e) {
            console.error('PDF download error:', e);
        } finally {
            setDownloadingPDF(false);
        }
    };

    const progress = submitted ? 100 : Math.round((step / TOTAL_STEPS) * 100);

    const canProceed = () => {
        switch (step) {
            case 1: return formData.email.includes('@') && formData.email.includes('.') && formData.firstName.trim().length > 0 && isBusinessEmail(formData.email);
            case 2: return formData.industry && formData.teamSize;
            case 3: return formData.q1 !== '' && formData.q2 !== '';
            case 4: return formData.q3 !== '' && formData.q4 !== '';
            case 5: return formData.q5 !== '' && formData.q6 !== '';
            case 6: return true; // processing (auto-proceed)
            case 7: return true; // score reveal
            case 8: return true; // optional
            case 9: return true; // optional
            case 10: return true; // review
            default: return true;
        }
    };

    const inputClass = "w-full bg-[#FAFAF8] border border-theme px-5 py-4 text-[15px] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-all";
    const labelClass = "block mono text-[10px] uppercase tracking-widest text-neutral-500 mb-3";
    const helperClass = "text-[12px] text-neutral-500 mt-2 leading-relaxed";

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
                    We&apos;re scoring your responses across 4 categories to build your personalized report.
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

    const renderSubmitted = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="text-left text-neutral-900">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-[#FAFAF8] border border-theme flex items-center justify-center">
                    <Check className="w-6 h-6 text-neutral-900" />
                </div>
                <div>
                    <h3 className="text-3xl tracking-tight font-normal">We&apos;re on it.</h3>
                    <p className="text-[14px] text-neutral-500 mt-1">Your diagnostic has been received.</p>
                </div>
            </div>
            <div className="mono text-[10px] text-neutral-500 uppercase tracking-widest mb-6">What happens next</div>
            <div className="space-y-0">
                {[
                    { step: "01", title: "Confirmation email sent", desc: "Check your inbox — you'll receive a confirmation with a summary of your responses.", time: "Now" },
                    { step: "02", title: "Operations analysis begins", desc: "We're running a full analysis of your workflow — identifying bottlenecks, wasted hours, and opportunities to put AI to work.", time: "Within 1 hour" },
                    { step: "03", title: "Roadmap & SEO Report delivered", desc: "Your operational roadmap and competitor SEO teardown land in your inbox. It maps exactly where you're losing time, money, and traffic, with specific solutions.", time: "Within 48 hours" }
                ].map((item, i) => (
                    <div key={i} className="grid grid-cols-[60px_1fr_auto] gap-6 py-6 border-t border-theme">
                        <div className="mono text-[10px] text-neutral-400 uppercase tracking-widest pt-1">{item.step}</div>
                        <div>
                            <div className="text-[15px] font-medium text-neutral-900 mb-1">{item.title}</div>
                            <div className="text-[14px] text-neutral-600 leading-relaxed">{item.desc}</div>
                        </div>
                        <div className="mono text-[10px] text-neutral-400 uppercase tracking-widest pt-1 text-right">{item.time}</div>
                    </div>
                ))}
            </div>
            <div className="mt-10 pt-8 border-t border-theme">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#FAFAF8] border border-theme flex items-center justify-center shrink-0">
                        <span className="mono text-[10px] text-neutral-400">IV</span>
                    </div>
                    <div>
                        <p className="text-[14px] text-neutral-600 leading-relaxed max-w-xl">
                            &quot;We review every diagnostic personally. Your roadmap won&apos;t be a template — it&apos;ll be built specifically around what you told us. If we see something urgent, we&apos;ll flag it before the 48 hours.&quot;
                        </p>
                        <p className="mono text-[10px] text-neutral-500 mt-4 uppercase tracking-widest">— Intellivance Team</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    // Category labels for display
    const CATEGORY_LABELS = {
        automation: 'Process Automation',
        techStack: 'Tech Stack Efficiency',
        manualWork: 'Manual Work Dependency',
        scalability: 'Scalability Risk',
    };

    // --- Render scored question card ---
    const renderQuestionCard = (question, questionIndex) => {
        const selectedValue = formData[question.id];
        return (
            <div key={question.id} className="mb-8 last:mb-0">
                <label className={labelClass}>Q{questionIndex + 1} — {question.question}</label>
                {question.subtitle && (
                    <p className={helperClass + " mb-4 mt-0"}>{question.subtitle}</p>
                )}
                <div className="grid grid-cols-1 gap-[1px] bg-theme overflow-hidden border border-theme">
                    {question.options.map((option) => (
                        <label
                            key={option.value}
                            className={`flex items-center justify-center py-4 px-5 bg-white cursor-pointer hover:bg-neutral-50 transition-all ${selectedValue === option.value ? 'bg-neutral-100 ring-1 ring-inset ring-neutral-900' : ''}`}
                        >
                            <input
                                type="radio"
                                value={option.value}
                                checked={selectedValue === option.value}
                                onChange={() => updateField(question.id, option.value)}
                                className="sr-only"
                            />
                            <span className={`text-[14px] transition-colors leading-relaxed text-center ${selectedValue === option.value ? 'text-neutral-900 font-medium' : 'text-neutral-500'}`}>
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        );
    };

    // --- Score Reveal Page ---
    const renderScoreReveal = () => {
        if (!scoreResults) return null;

        const { totalScore, maxScore, overallRating, categories, ratings } = scoreResults;

        return (
            <div className="space-y-8">
                {/* Big score display */}
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
                                            <span className={`mono text-[9px] uppercase tracking-widest font-semibold`} style={{ color: rating.color || '#777' }}>
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

                {/* Actions */}
                <div className="pt-4 space-y-3">
                    <button
                        onClick={handleDownloadPDF}
                        disabled={downloadingPDF}
                        className="w-full btn-tech group flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Download className="w-3.5 h-3.5" />
                        {downloadingPDF ? 'Generating PDF...' : 'Download Full Report (PDF)'}
                    </button>
                    <p className="text-[12px] text-neutral-400 text-center">We&apos;ve also emailed you the full report.</p>
                </div>

                {/* Secondary CTA */}
                <div className="pt-4 border-t border-theme text-center">
                    <button
                        onClick={() => navigateStep(step + 1)}
                        className="text-[13px] text-neutral-600 hover:text-neutral-900 transition-colors leading-relaxed"
                    >
                        Want a deeper analysis? Tell us more about your operations <ChevronRight className="w-3.5 h-3.5 inline-block ml-0.5" />
                    </button>
                </div>
            </div>
        );
    };

    const renderStepContent = () => {
        switch (step) {
            // Step 1: Email + First Name (email-first gate)
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-[#FAFAF8] border border-theme flex items-center justify-center">
                                <Mail className="w-4 h-4 text-neutral-900" />
                            </div>
                            <p className="text-[14px] text-neutral-600 leading-relaxed">
                                Takes 2 minutes. See exactly where your business stands — and what to fix first.
                            </p>
                        </div>
                        <div>
                            <label className={labelClass}>First name</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={e => updateField('firstName', e.target.value)}
                                placeholder="First name"
                                className={inputClass}
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Business Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => {
                                    updateField('email', e.target.value);
                                    // Clear error when typing, re-validate on blur
                                    if (emailError) setEmailError('');
                                }}
                                onBlur={() => validateEmail(formData.email)}
                                placeholder="you@company.com"
                                className={`${inputClass} ${emailError ? 'border-red-400' : ''}`}
                            />
                            {emailError && (
                                <p className="text-[12px] text-red-500 mt-2 leading-relaxed">{emailError}</p>
                            )}
                        </div>
                        <p className="text-[12px] text-neutral-400 leading-relaxed">No spam. No calls. Just your score.</p>
                    </div>
                );

            // Step 2: Industry + Team Size (CRM segmentation)
            case 2:
                return (
                    <div className="space-y-8">
                        <div>
                            <label className={labelClass}>Industry</label>
                            <select value={formData.industry} onChange={e => updateField('industry', e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                                <option value="" disabled>What kind of business?</option>
                                <option value="service">Service business (HVAC, cleaning, auto, etc.)</option>
                                <option value="ecommerce">E-commerce / DTC brand</option>
                                <option value="professional">Professional services (law, consulting, accounting)</option>
                                <option value="healthcare">Healthcare / wellness</option>
                                <option value="agency">Agency / creative</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Team size</label>
                            <div className="grid grid-cols-4 gap-[1px] bg-theme overflow-hidden border border-theme">
                                {[{ label: "Just me", value: "solo" }, { label: "2-5", value: "small" }, { label: "6-20", value: "medium" }, { label: "20+", value: "large" }].map((opt) => (
                                    <label key={opt.value} className={`flex flex-col items-center justify-center py-4 px-3 bg-white text-center cursor-pointer hover:bg-neutral-50 transition-all ${formData.teamSize === opt.value ? 'bg-neutral-100 ring-1 ring-inset ring-neutral-900' : ''}`}>
                                        <input type="radio" value={opt.value} checked={formData.teamSize === opt.value} onChange={() => updateField('teamSize', opt.value)} className="sr-only" />
                                        <span className={`text-[14px] font-medium transition-colors ${formData.teamSize === opt.value ? 'text-neutral-900' : 'text-neutral-500'}`}>{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            // Steps 3-5: Scored Questions (2 per screen)
            case 3:
            case 4:
            case 5: {
                const pairIndex = step - 3; // 0, 1, 2
                const pair = QUESTION_PAIRS[pairIndex];
                const startQ = pairIndex * 2; // 0, 2, 4
                return (
                    <div className="space-y-2">
                        {pair.map((question, i) => renderQuestionCard(question, startQ + i))}
                    </div>
                );
            }

            // Step 6: Processing (handled by renderProcessing)
            case 6:
                return null;

            // Step 7: Score Reveal
            case 7:
                return renderScoreReveal();

            // Step 8: Optional — Weekly Workflow
            case 8:
                return (
                    <div className="space-y-6">
                        <div className="flex items-start gap-3 py-4 px-5 border border-theme bg-white">
                            <div className="mono text-xs text-neutral-900 uppercase shrink-0 mt-0.5">[ OPTIONAL ]</div>
                            <p className="text-[13px] text-neutral-600 leading-relaxed">
                                The more detail you share about your day-to-day, the sharper your personalized roadmap will be. Use voice-to-text on your phone for speed.
                            </p>
                        </div>
                        <div>
                            <label className={labelClass}>Walk us through your week</label>
                            <p className={helperClass + " mb-3"}>What does Monday morning look like? What tasks eat your time? What falls through the cracks? What do you wish just ran itself?</p>
                            <textarea rows="6" value={formData.weeklyWorkflow} onChange={e => updateField('weeklyWorkflow', e.target.value)} placeholder="The more specific you are, the more useful your roadmap. Voice-to-text works great here..." className={`${inputClass} resize-none`} />
                        </div>
                    </div>
                );

            // Step 9: Optional — Money Loss + Timeline
            case 9:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className={labelClass}>Where are you losing money?</label>
                            <p className={helperClass + " mb-3"}>Missed follow-ups, slow proposals, manual data entry, customer churn — what&apos;s the thing you know is costing you but haven&apos;t fixed?</p>
                            <textarea rows="4" value={formData.moneyLoss} onChange={e => updateField('moneyLoss', e.target.value)} placeholder="Be specific..." className={`${inputClass} resize-none`} />
                        </div>
                        <div>
                            <label className={labelClass}>Timeline</label>
                            <p className={helperClass + " mb-4"}>How urgently do you need this solved?</p>
                            <div className="grid grid-cols-3 gap-[1px] bg-theme overflow-hidden border border-theme">
                                {[{ label: "Exploring options", sub: "No rush", value: "exploring" }, { label: "Ready this quarter", sub: "Let's plan", value: "quarter" }, { label: "Need it yesterday", sub: "Urgent", value: "urgent" }].map((option) => (
                                    <label key={option.value} className={`flex flex-col items-center justify-center py-5 px-4 bg-white text-center cursor-pointer hover:bg-neutral-50 transition-all ${formData.timeline === option.value ? 'bg-neutral-100 ring-1 ring-inset ring-neutral-900' : ''}`}>
                                        <input type="radio" value={option.value} checked={formData.timeline === option.value} onChange={() => updateField('timeline', option.value)} className="sr-only" />
                                        <span className={`text-[14px] font-medium transition-colors ${formData.timeline === option.value ? 'text-neutral-900' : 'text-neutral-500'}`}>{option.label}</span>
                                        <span className={`mono text-[9px] mt-2 uppercase tracking-widest ${formData.timeline === option.value ? 'text-neutral-600' : 'text-neutral-400'}`}>{option.sub}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            // Step 10: Review & Submit
            case 10:
                return (
                    <div className="space-y-6">
                        <div className="mono text-[10px] text-neutral-500 uppercase tracking-widest mb-4">Review your responses</div>

                        {/* Score summary at top */}
                        {scoreResults && (
                            <div className="flex items-center justify-between py-4 border-t border-theme">
                                <span className="mono text-[10px] text-neutral-600 uppercase tracking-widest">AI Readiness Score</span>
                                <span className={`text-[16px] font-bold ${getScoreColorClass(scoreResults.totalScore, scoreResults.maxScore)}`}>
                                    {scoreResults.totalScore}/100 — {scoreResults.overallRating}
                                </span>
                            </div>
                        )}

                        {[
                            { label: "Name", value: formData.firstName },
                            { label: "Email", value: formData.email },
                            { label: "Industry", value: formData.industry },
                            { label: "Team Size", value: formData.teamSize },
                            { label: "Weekly Workflow", value: formData.weeklyWorkflow, truncate: true },
                            { label: "Money Loss", value: formData.moneyLoss, truncate: true },
                            { label: "Timeline", value: formData.timeline },
                        ].filter(item => item.value).map((item, i) => (
                            <div key={i} className="flex items-start justify-between py-4 border-t border-theme">
                                <span className="mono text-[10px] text-neutral-600 uppercase tracking-widest shrink-0 mr-4 mt-1">{item.label}</span>
                                <span className="text-[14px] text-neutral-900 text-right leading-relaxed max-w-sm">
                                    {item.truncate && item.value.length > 80 ? item.value.slice(0, 80) + '...' : item.value}
                                </span>
                            </div>
                        ))}

                        {/* Optional fields prompt */}
                        <div className="pt-2">
                            <label className={labelClass}>Website <span className="text-neutral-400 normal-case tracking-normal text-[12px] ml-1">(optional)</span></label>
                            <input type="url" value={formData.website} onChange={e => updateField('website', e.target.value)} placeholder="yourcompany.com" className={inputClass} />
                            <p className="text-[12px] text-neutral-500 mt-2">We need your URL to run the free SEO and competitor analysis report.</p>
                        </div>
                        <div>
                            <label className={labelClass}>Phone <span className="text-neutral-400 normal-case tracking-normal text-[12px] ml-1">(optional)</span></label>
                            <input type="tel" value={formData.phone} onChange={e => updateField('phone', e.target.value)} placeholder="(555) 000-0000" className={inputClass} />
                        </div>

                        {/* Honeypot for bot protection */}
                        <div className="absolute -left-[9999px]" aria-hidden="true">
                            <input type="text" name="company_address" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                        </div>
                    </div>
                );

            default: return null;
        }
    };

    const stepHeadings = {
        1: "Get your free AI Readiness Score.",
        2: "Tell us about your business.",
        3: "How does your business operate?",
        4: "Leads and performance tracking.",
        5: "Scaling and manual work.",
        6: "Calculating your score...",
        7: "Your AI Readiness Score.",
        8: "Help us build your roadmap.",
        9: "Where's the bleeding?",
        10: "Review & submit.",
    };

    // Determine which buttons to show based on step
    const isScoreRevealStep = step === 7;
    const isProcessingStep = step === 6;

    return (
        <div className="selection:bg-neutral-900 selection:text-white">
            <Navbar />
            <main className="pt-16 min-h-screen flex items-center justify-center px-4 sm:px-6 bg-[#EAEAE5] relative overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>
                <div className="max-w-2xl w-full relative z-10 py-8 sm:py-14 lg:py-20 min-h-0 lg:min-h-[600px]">

                    {/* Outer Form Container */}
                    <div className="bg-white border border-theme p-5 sm:p-8 lg:p-12 shadow-sm">

                        {processing ? renderProcessing() : submitted ? renderSubmitted() : (
                            <>
                                {/* Progress header */}
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

                                {/* Navigation Footer */}
                                {!isProcessingStep && (
                                    <div className="flex items-center justify-between mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-theme">
                                        {step > 1 && step !== 7 ? (
                                            <button onClick={() => navigateStep(step - 1)} className="flex items-center gap-2 mono text-[10px] text-neutral-500 uppercase tracking-widest hover:text-neutral-900 transition-colors">
                                                <ArrowLeft className="w-3.5 h-3.5" /> Back
                                            </button>
                                        ) : <div />}

                                        {isScoreRevealStep ? (
                                            <div className="flex items-center gap-3">
                                                <button onClick={handleEarlySubmit} className="mono text-[10px] text-neutral-500 uppercase tracking-widest hover:text-neutral-900 transition-colors">
                                                    Submit now
                                                </button>
                                                <button onClick={() => navigateStep(step + 1)} className="btn-tech group flex items-center gap-2">
                                                    Tell us more
                                                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                                </button>
                                            </div>
                                        ) : step < TOTAL_STEPS ? (
                                            <button onClick={() => navigateStep(step + 1)} disabled={!canProceed()} className="btn-tech group flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
                                                Continue
                                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                            </button>
                                        ) : (
                                            <button onClick={handleFinalSubmit} className="btn-tech group flex items-center gap-2">
                                                Submit for Analysis
                                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                            </button>
                                        )}
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
