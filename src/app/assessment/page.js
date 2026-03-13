"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Shield, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUTM, utmToQueryString } from '@/hooks/useUTM';

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

const TOTAL_STEPS = 7;

export default function AssessmentPage() {
    const [step, setStep] = useState(1);
    const [token, setToken] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [honeypot, setHoneypot] = useState('');
    const utmData = useUTM();

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
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token');
        const session = loadSession(urlToken);
        if (session) {
            setToken(session.token);
            setFormData(session.formData);
            setStep(session.currentStep);
        }
    }, []);

    useEffect(() => {
        if (token && step > 1) {
            saveSession(token, {
                token,
                formData,
                currentStep: step,
                updatedAt: new Date().toISOString(),
            });
        }
    }, [step, formData, token]);

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

    const goNext = () => {
        if (!token) initSession();

        if (step === 2) {
            setProcessing(true);
            setTimeout(() => {
                setProcessing(false);
                setStep(3);
            }, 2800);
            return;
        }

        if (step === 3) syncWithBackend(false);

        if (step < TOTAL_STEPS) setStep(prev => prev + 1);
    };

    const goBack = () => {
        if (step > 1) setStep(prev => prev - 1);
    };

    const handleFinalSubmit = async () => {
        setProcessing(true);
        await syncWithBackend(true);
        setTimeout(() => {
            clearSession();
            window.location.href = '/assessment/thank-you' + utmToQueryString(utmData);
        }, 800);
    };

    const progress = submitted ? 100 : Math.round((step / TOTAL_STEPS) * 100);

    const canProceed = () => {
        switch (step) {
            case 1: return formData.industry && formData.teamSize;
            case 2: return formData.weeklyWorkflow.trim().length > 20;
            case 3: return formData.email.includes('@') && formData.email.includes('.');
            case 4: return formData.moneyLoss.trim().length > 10;
            case 5: return formData.timeline !== '';
            case 6: return formData.firstName.trim().length > 0;
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
                <h3 className="text-2xl font-normal tracking-tight text-neutral-900 mb-3">Analyzing your workflow...</h3>
                <p className="text-[14px] text-neutral-500 max-w-sm mx-auto leading-relaxed">
                    Our AI is mapping your operational patterns to find the biggest opportunities to save you time and money.
                </p>
                <div className="mt-8 space-y-3 text-left max-w-xs mx-auto">
                    {[
                        { label: "Parsing operational workflow", delay: 0 },
                        { label: "Identifying bottlenecks", delay: 0.8 },
                        { label: "Mapping operational improvements", delay: 1.6 },
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
                            "We review every diagnostic personally. Your roadmap won't be a template — it'll be built specifically around what you told us. If we see something urgent, we'll flag it before the 48 hours."
                        </p>
                        <p className="mono text-[10px] text-neutral-500 mt-4 uppercase tracking-widest">— Intellivance Team</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-8">
                        <div>
                            <label className={labelClass}>01 — Industry</label>
                            <select value={formData.industry} onChange={e => updateField('industry', e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                                <option value="" disabled>What kind of business?</option>
                                <option value="service" >Service business (HVAC, cleaning, auto, etc.)</option>
                                <option value="ecommerce" >E-commerce / DTC brand</option>
                                <option value="professional" >Professional services (law, consulting, accounting)</option>
                                <option value="healthcare" >Healthcare / wellness</option>
                                <option value="agency" >Agency / creative</option>
                                <option value="other" >Other</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>02 — Team size</label>
                            <div className="grid grid-cols-4 gap-[1px] bg-theme overflow-hidden border border-theme">
                                {[{ label: "Just me", value: "solo" }, { label: "2–5", value: "small" }, { label: "6–20", value: "medium" }, { label: "20+", value: "large" }].map((opt) => (
                                    <label key={opt.value} className={`flex flex-col items-center justify-center py-4 px-3 bg-white text-center cursor-pointer hover:bg-neutral-50 transition-all ${formData.teamSize === opt.value ? 'bg-neutral-100 ring-1 ring-inset ring-neutral-900' : ''}`}>
                                        <input type="radio" value={opt.value} checked={formData.teamSize === opt.value} onChange={() => updateField('teamSize', opt.value)} className="sr-only" />
                                        <span className={`text-[14px] font-medium transition-colors ${formData.teamSize === opt.value ? 'text-neutral-900' : 'text-neutral-500'}`}>{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="flex items-start gap-3 py-4 px-5 border border-theme bg-white">
                            <div className="mono text-xs text-neutral-900 uppercase shrink-0 mt-0.5">[ PRO_TIP ]</div>
                            <p className="text-[13px] text-neutral-600 leading-relaxed">
                                Use voice-to-text on your phone. The more detail you give about your day-to-day, the sharper your roadmap will be.
                            </p>
                        </div>
                        <div>
                            <label className={labelClass}>03 — Walk us through your week</label>
                            <p className={helperClass + " mb-3"}>What does Monday morning look like? What tasks eat your time? What falls through the cracks? What do you wish just ran itself?</p>
                            <textarea rows="6" value={formData.weeklyWorkflow} onChange={e => updateField('weeklyWorkflow', e.target.value)} placeholder="The more specific you are, the more useful your roadmap. Voice-to-text works great here..." className={`${inputClass} resize-none`} />
                            <div className="flex items-center justify-between mt-2">
                                <p className={helperClass}>Minimum 20 characters</p>
                                <span className={`mono text-[10px] tracking-widest ${formData.weeklyWorkflow.length >= 20 ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                    {formData.weeklyWorkflow.length} chars
                                </span>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-[#FAFAF8] border border-theme flex items-center justify-center">
                                <Mail className="w-4 h-4 text-neutral-900" />
                            </div>
                            <p className="text-[16px] font-medium text-neutral-900">We&apos;re analyzing your inputs.</p>
                        </div>
                        <p className="text-[14px] text-neutral-600 leading-relaxed">
                            We're building a custom operations blueprint and an SEO/competitor teardown based on what you described. Where should we send the final report?
                        </p>
                        <p className="text-[13px] text-neutral-500 leading-relaxed bg-[#FAFAF8] p-4 border border-theme">
                            We&apos;ll also save your progress here so you don&apos;t lose your work if you get pulled away.
                        </p>
                        <div>
                            <label className={labelClass}>Your email</label>
                            <input type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="you@company.com" className={inputClass} autoFocus />
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className={labelClass}>04 — Where are you losing money?</label>
                            <p className={helperClass + " mb-3"}>Missed follow-ups, slow proposals, manual data entry, customer churn — what&apos;s the thing you know is costing you but haven&apos;t fixed?</p>
                            <textarea rows="4" value={formData.moneyLoss} onChange={e => updateField('moneyLoss', e.target.value)} placeholder="Be specific..." className={`${inputClass} resize-none`} />
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className={labelClass}>05 — Timeline</label>
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
            case 6:
                return (
                    <div className="space-y-6">
                        <div>
                            <div className="mono text-[10px] text-neutral-500 uppercase tracking-widest mb-4">Almost done — a few final details</div>
                            <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className={labelClass}>First name</label>
                                    <input type="text" value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} placeholder="First name" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Website <span className="text-neutral-400 normal-case tracking-normal text-[12px] ml-1">(optional)</span></label>
                                    <input type="url" value={formData.website} onChange={e => updateField('website', e.target.value)} placeholder="yourcompany.com" className={inputClass} />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Phone <span className="text-neutral-400 normal-case tracking-normal text-[12px] ml-1">(optional)</span></label>
                                <input type="tel" value={formData.phone} onChange={e => updateField('phone', e.target.value)} placeholder="(555) 000-0000" className={inputClass} />
                                <p className="text-[12px] text-neutral-500 mt-2">We need your URL to run the free SEO and competitor analysis report.</p>
                            </div>
                        </div>
                    </div>
                );
            case 7:
                return (
                    <div className="space-y-6">
                        <div className="mono text-[10px] text-neutral-500 uppercase tracking-widest mb-4">Review your responses</div>
                        {[{ label: "Industry", value: formData.industry }, { label: "Team Size", value: formData.teamSize }, { label: "Weekly Workflow", value: formData.weeklyWorkflow, truncate: true }, { label: "Money Loss", value: formData.moneyLoss, truncate: true }, { label: "Timeline", value: formData.timeline }, { label: "Email", value: formData.email }, { label: "Name", value: formData.firstName }].filter(item => item.value).map((item, i) => (
                            <div key={i} className="flex items-start justify-between py-4 border-t border-theme">
                                <span className="mono text-[10px] text-neutral-600 uppercase tracking-widest shrink-0 mr-4 mt-1">{item.label}</span>
                                <span className="text-[14px] text-neutral-900 text-right leading-relaxed max-w-sm">
                                    {item.truncate && item.value.length > 80 ? item.value.slice(0, 80) + '...' : item.value}
                                </span>
                            </div>
                        ))}
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
        1: "Tell us about your business.",
        2: "Describe your week.",
        3: "Save your progress.",
        4: "Where's the bleeding?",
        5: "How urgent is this?",
        6: "Final details.",
        7: "Review & submit.",
    };

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

                                <div className="flex items-center justify-between mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-theme">
                                    {step > 1 ? (
                                        <button onClick={() => navigateStep(step - 1)} className="flex items-center gap-2 mono text-[10px] text-neutral-500 uppercase tracking-widest hover:text-neutral-900 transition-colors">
                                            <ArrowLeft className="w-3.5 h-3.5" /> Back
                                        </button>
                                    ) : <div />}

                                    {step < TOTAL_STEPS ? (
                                        <button onClick={() => navigateStep(step + 1)} disabled={!canProceed()} className="btn-tech group flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
                                            {step === 3 ? 'Save & Continue' : 'Continue'}
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    ) : (
                                        <button onClick={handleFinalSubmit} className="btn-tech group flex items-center gap-2">
                                            Submit for Analysis
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
