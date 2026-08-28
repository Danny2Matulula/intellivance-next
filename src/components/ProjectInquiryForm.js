"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./ProjectInquiryForm.module.css";

const initialState = { fullName: "", email: "", company: "", project: "", website: "" };

export default function ProjectInquiryForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("idle");

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submitInquiry(event) {
    event.preventDefault();
    setStatus("submitting");
    try {
      const response = await fetch("/api/project-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Inquiry delivery failed");
      setStatus("success");
      setForm(initialState);
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", { event_category: "operating_partner_inquiry", event_label: "contact_page_form" });
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.success} role="status" aria-live="polite">
        <span>Inquiry received</span>
        <h2>Thanks. We have the messy version.</h2>
        <p>We&apos;ll review the situation and reply by email.</p>
        <a href="mailto:hello@intellivance.ai">Need to add something?</a>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submitInquiry}>
      <div className={styles.formIntro}>
        <span>Start here</span>
        <p>No finished brief required.</p>
      </div>
      <div className={styles.fieldGrid}>
        <label className={styles.field}><span>Name</span><input name="fullName" autoComplete="name" value={form.fullName} onChange={updateField} maxLength={100} required /></label>
        <label className={styles.field}><span>Work email</span><input name="email" type="email" autoComplete="email" value={form.email} onChange={updateField} maxLength={254} required /></label>
      </div>
      <label className={styles.field}><span>Company <small>optional</small></span><input name="company" autoComplete="organization" value={form.company} onChange={updateField} maxLength={160} /></label>
      <label className={styles.field}>
        <span>What is moving—and what is stuck?</span>
        <textarea name="project" value={form.project} onChange={updateField} rows={7} minLength={20} maxLength={4000} placeholder="Tell us the outcome that matters, what has already been tried, and where execution is breaking down." required />
      </label>
      <label className={styles.honeypot} aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={updateField} /></label>
      <div className={styles.formFooter}>
        <button type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Sending…" : "Send the situation"}<span aria-hidden="true">↗</span></button>
        <p>Your details are used only to respond to this inquiry. <Link href="/privacy-policy">Privacy</Link></p>
      </div>
      {status === "error" ? <p className={styles.error} role="alert">The form could not send. Email <a href="mailto:hello@intellivance.ai">hello@intellivance.ai</a>.</p> : null}
    </form>
  );
}
