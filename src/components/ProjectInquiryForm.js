"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./ProjectInquiryForm.module.css";

const initialState = {
  fullName: "",
  email: "",
  company: "",
  project: "",
  website: "",
};

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18">
      <path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

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
        window.gtag("event", "generate_lead", {
          event_category: "project_inquiry",
          event_label: "homepage_contact_form",
        });
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.success} role="status" aria-live="polite">
        <span className={styles.successLabel}>Inquiry received</span>
        <h3>Thanks. We have the messy version.</h3>
        <p>We&apos;ll review what you shared and reply by email.</p>
        <a href="mailto:hello@intellivance.ai">Need to add something?</a>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submitInquiry} noValidate={false}>
      <div className={styles.formIntro}>
        <span>Project inquiry</span>
        <p>No finished specification required.</p>
      </div>

      <div className={styles.fieldGrid}>
        <label className={styles.field}>
          <span>Name</span>
          <input name="fullName" type="text" autoComplete="name" value={form.fullName} onChange={updateField} maxLength={100} required />
        </label>
        <label className={styles.field}>
          <span>Work email</span>
          <input name="email" type="email" autoComplete="email" value={form.email} onChange={updateField} maxLength={254} required />
        </label>
      </div>

      <label className={styles.field}>
        <span>Company <small>optional</small></span>
        <input name="company" type="text" autoComplete="organization" value={form.company} onChange={updateField} maxLength={160} />
      </label>

      <label className={styles.field}>
        <span>What are you trying to build?</span>
        <textarea
          name="project"
          value={form.project}
          onChange={updateField}
          rows={6}
          minLength={20}
          maxLength={4000}
          placeholder="A workflow, product idea, internal tool, system connection—start wherever the problem is clearest."
          required
        />
      </label>

      <label className={styles.honeypot} aria-hidden="true">
        Website
        <input name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={updateField} />
      </label>

      <div className={styles.formFooter}>
        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send project details"}
          {status !== "submitting" ? <ArrowIcon /> : null}
        </button>
        <p>Your details are used only to respond to this inquiry. <Link href="/privacy-policy">Privacy</Link></p>
      </div>

      {status === "error" ? (
        <p className={styles.error} role="alert">
          The form could not send. Email us directly at <a href="mailto:hello@intellivance.ai">hello@intellivance.ai</a>.
        </p>
      ) : null}
    </form>
  );
}
