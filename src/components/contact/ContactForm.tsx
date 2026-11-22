"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { isValidEmail } from "@/lib/utils";

interface Errors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const next: Errors = {};
    if (!name.trim() || name.trim().length < 2) {
      next.name = "Please enter your name.";
    }
    if (!email.trim() || !isValidEmail(email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!subject.trim()) {
      next.subject = "Please enter a subject.";
    }
    if (!message.trim() || message.trim().length < 10) {
      next.message = "Please enter a message of at least 10 characters.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setErrors({});
  };

  if (submitted) {
    return (
      <div className="border border-[#171717] bg-[#F7F4EE] p-8 sm:p-10 text-center vintage-shadow">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#171717] bg-[#795548] text-white">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-editorial text-3xl text-[#171717]">
          Message Received
        </h3>
        <p className="mt-2 text-sm text-[#171717]/75 max-w-md mx-auto">
          Thank you for reaching out to BGC Coffee Co. In this local prototype,
          your inquiry has been validated and recorded locally.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 border border-[#171717] bg-[#171717] px-6 py-3 font-display text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-[#795548] cursor-pointer"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="border border-[#171717] bg-white p-6 sm:p-8 vintage-shadow"
    >
      <h2 className="font-editorial text-3xl text-[#171717] border-b border-[#171717] pb-3">
        Send Us a Note
      </h2>
      <p className="mt-3 text-sm text-[#171717]/65">
        Questions about pickup orders, menu offerings, or feedback? Let us know.
      </p>

      <div className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="contact-name"
              className="block font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[#171717]"
            >
              Your Name <span className="text-[#795548]">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="mt-2 w-full border border-[#171717] bg-[#F7F4EE]/50 px-4 py-3 text-sm text-[#171717] focus:border-[#795548] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#795548]"
            />
            {errors.name && (
              <p className="mt-1 text-xs font-medium text-[#795548]">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="contact-email"
              className="block font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[#171717]"
            >
              Email Address <span className="text-[#795548]">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full border border-[#171717] bg-[#F7F4EE]/50 px-4 py-3 text-sm text-[#171717] focus:border-[#795548] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#795548]"
            />
            {errors.email && (
              <p className="mt-1 text-xs font-medium text-[#795548]">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-subject"
            className="block font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[#171717]"
          >
            Subject <span className="text-[#795548]">*</span>
          </label>
          <input
            id="contact-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Order inquiry, partnership, feedback..."
            className="mt-2 w-full border border-[#171717] bg-[#F7F4EE]/50 px-4 py-3 text-sm text-[#171717] focus:border-[#795548] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#795548]"
          />
          {errors.subject && (
            <p className="mt-1 text-xs font-medium text-[#795548]">
              {errors.subject}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="block font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[#171717]"
          >
            Message <span className="text-[#795548]">*</span>
          </label>
          <textarea
            id="contact-message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            className="mt-2 w-full border border-[#171717] bg-[#F7F4EE]/50 px-4 py-3 text-sm text-[#171717] focus:border-[#795548] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#795548]"
          />
          {errors.message && (
            <p className="mt-1 text-xs font-medium text-[#795548]">
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 border border-[#171717] bg-[#171717] px-8 py-3.5 font-display text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-[#795548] hover:border-[#795548] transition-colors cursor-pointer"
        >
          <Send className="h-4 w-4" />
          Send Message
        </button>
      </div>
    </form>
  );
}
