"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-[6px] border border-vt-success/25 bg-vt-success/5 p-6 text-vt-navy">
        <h3 className="font-semibold tracking-[-0.01em]">Thanks  -  message captured locally.</h3>
        <p className="mt-2 text-sm text-vt-slate">
          Wire this form to your CRM or email endpoint when you deploy. For now, email{" "}
          <a className="font-medium text-vt-navy underline underline-offset-2" href="mailto:info@vigitrust.com">
            info@vigitrust.com
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
      <Field label="First Name" name="firstName" required />
      <Field label="Last Name" name="lastName" required />
      <Field label="Email Address" name="email" type="email" required />
      <Field label="Phone Number" name="phone" type="tel" />
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-[13px] font-medium text-vt-slate" htmlFor="message">
          Message <span className="text-vt-red">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="input-field"
          placeholder="How can we help?"
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" variant="navy">
          Send message
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-vt-slate" htmlFor={name}>
        {label} {required ? <span className="text-vt-red">*</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="input-field"
        placeholder={label}
      />
    </div>
  );
}
