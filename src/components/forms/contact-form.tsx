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
      <div className="rounded-[10px] bg-vt-success/10 p-6 text-vt-navy ring-1 ring-vt-success/30">
        <h3 className="font-semibold">Thanks  -  message captured locally.</h3>
        <p className="mt-2 text-sm">
          Wire this form to your CRM or email endpoint when you deploy. For now, email{" "}
          <a className="underline" href="mailto:info@vigitrust.com">
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
        <label className="mb-1.5 block text-sm font-medium text-vt-slate" htmlFor="message">
          Message <span className="text-vt-red">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-[6px] bg-vt-mist px-3 py-2.5 text-vt-ink ring-1 ring-vt-border placeholder:text-vt-muted focus:ring-2 focus:ring-vt-red"
          placeholder="How can we help?"
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg">
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
      <label className="mb-1.5 block text-sm font-medium text-vt-slate" htmlFor={name}>
        {label} {required ? <span className="text-vt-red">*</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-[6px] bg-vt-mist px-3 py-2.5 text-vt-ink ring-1 ring-vt-border placeholder:text-vt-muted focus:ring-2 focus:ring-vt-red"
        placeholder={label}
      />
    </div>
  );
}
