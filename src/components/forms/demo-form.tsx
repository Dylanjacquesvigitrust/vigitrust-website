"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

export function DemoForm() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-[6px] border border-vt-success/25 bg-vt-success/5 p-6 text-vt-navy">
        <h2 className="font-semibold tracking-[-0.01em]">Demo request captured.</h2>
        <p className="mt-2 text-sm text-vt-slate">
          Connect this form to your scheduling or CRM tool for production. Meanwhile email{" "}
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
      <Field label="Full Name" name="name" required />
      <Field label="Work Email" name="email" type="email" required />
      <Field label="Company" name="company" required />
      <Field label="Phone" name="phone" type="tel" />
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-[13px] font-medium text-vt-slate" htmlFor="interest">
          What would you like to see? <span className="text-vt-red">*</span>
        </label>
        <select
          id="interest"
          name="interest"
          required
          className="input-field"
          defaultValue=""
        >
          <option value="" disabled>
            Select an option
          </option>
          <option>VigiOne Platform</option>
          <option>Assessment 360</option>
          <option>eLearning / Phishing</option>
          <option>Assessor workflows</option>
          <option>Not sure yet</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-[13px] font-medium text-vt-slate" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          className="input-field"
          placeholder="Frameworks, number of entities, timeline…"
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg">
          Request demo
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
      <input id={name} name={name} type={type} required={required} className="input-field" />
    </div>
  );
}
