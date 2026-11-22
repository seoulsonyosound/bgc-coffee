import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with BGC Coffee Co. View store hours, location placeholders, and send us a message.",
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      <section className="bg-paper-grain text-[#171717] py-14 sm:py-18 border-b border-[#171717]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="font-display text-xs font-bold uppercase tracking-[0.24em] text-[#795548]">
            Correspondence • Say Hello
          </p>
          <h1 className="mt-2 font-editorial text-5xl text-[#171717] sm:text-6xl">
            Contact BGC Coffee Co.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#171717]/75 sm:text-base">
            Have a question about our menu or your pickup order? Reach out using
            the form below or visit our store counter.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Contact Info Placeholders */}
          <div className="lg:col-span-2 space-y-4">
            <div className="border border-[#171717] bg-[#F7F4EE] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#171717] bg-[#171717] text-white">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-[#795548]">
                    Store Location
                  </h2>
                  <p className="mt-1.5 text-sm text-[#171717]/80">
                    [Store Address Placeholder — Ground Floor Commercial Unit,
                    Metro Manila, Philippines]
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-[#171717] bg-[#F7F4EE] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#171717] bg-[#171717] text-white">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-[#795548]">
                    Business Hours
                  </h2>
                  <p className="mt-1.5 text-sm text-[#171717]/80">
                    [Monday – Friday: 7:00 AM – 10:00 PM Placeholder]
                  </p>
                  <p className="text-sm text-[#171717]/80">
                    [Saturday – Sunday: 8:00 AM – 10:00 PM Placeholder]
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-[#171717] bg-[#F7F4EE] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#171717] bg-[#171717] text-white">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-[#795548]">
                    Contact Number
                  </h2>
                  <p className="mt-1.5 text-sm text-[#171717]/80">
                    [Phone Placeholder — (02) 8000-0000 / 0900-000-0000]
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-[#171717] bg-[#F7F4EE] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#171717] bg-[#171717] text-white">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-[#795548]">
                    Email
                  </h2>
                  <p className="mt-1.5 text-sm text-[#171717]/80">
                    [Email Placeholder — hello@bgccoffee.example]
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
