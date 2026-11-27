import type { Metadata } from "next";
import { Clock, ExternalLink, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with BGC Coffee Co. View our store map in San Fernando, Pampanga, store hours, social feeds, and send us a message.",
};

const STORE_ADDRESS =
  "803, 8th Ave., Del Pilar, City of San Fernando, Pampanga 2000";
const GOOGLE_MAPS_QUERY = encodeURIComponent(STORE_ADDRESS);
const GOOGLE_MAPS_EMBED_URL = `https://maps.google.com/maps?q=${GOOGLE_MAPS_QUERY}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
const GOOGLE_MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${GOOGLE_MAPS_QUERY}`;

const SOCIAL_EMBEDS = [
  {
    platform: "Facebook",
    handle: "facebook.com/bgccoffeeco",
    href: "https://facebook.com/bgccoffeeco",
    embedUrl:
      "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fbgccoffeeco&tabs=timeline&width=380&height=420&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true",
    title: "BGC Coffee Co. Facebook Page",
  },
  {
    platform: "Instagram",
    handle: "@bgccoffeeco",
    href: "https://instagram.com/bgccoffeeco",
    embedUrl: "https://www.instagram.com/bgccoffeeco/embed",
    title: "BGC Coffee Co. Instagram Profile",
  },
  {
    platform: "TikTok",
    handle: "@bgc.coffee.co",
    href: "https://www.tiktok.com/@bgc.coffee.co",
    embedUrl: "https://www.tiktok.com/embed/@bgc.coffee.co",
    title: "BGC Coffee Co. TikTok Profile",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Editorial Header */}
      <section className="bg-paper-grain text-[#171717] py-14 sm:py-18 border-b border-[#171717]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="font-display text-xs font-bold uppercase tracking-[0.24em] text-[#795548]">
            Correspondence • Say Hello
          </p>
          <h1 className="mt-2 font-editorial text-5xl text-[#171717] sm:text-6xl">
            Contact BGC Coffee Co.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#171717]/75 sm:text-base">
            Have a question about our menu or your pickup order? Visit our
            counter in San Fernando, Pampanga, connect with us online, or send
            us a note below.
          </p>
        </div>
      </section>

      {/* Connect Section: Embedded Facebook, Instagram & TikTok */}
      <section className="bg-white border-b border-[#171717] py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#171717] pb-4">
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#795548]">
                Connect With Us
              </p>
              <h2 className="mt-2 font-editorial text-3xl text-[#171717] sm:text-4xl">
                Follow Our Daily Brews
              </h2>
            </div>
            <p className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-[#171717]/65">
              FACEBOOK · INSTAGRAM · TIKTOK
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {SOCIAL_EMBEDS.map((social) => (
              <div
                key={social.platform}
                className="flex flex-col border border-[#171717] bg-white vintage-shadow-sm"
              >
                {/* Social Card Header */}
                <div className="flex items-center justify-between gap-3 border-b border-[#171717] bg-[#F7F4EE] px-4 py-3">
                  <div>
                    <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-[#795548]">
                      {social.platform}
                    </p>
                    <p className="text-xs font-semibold text-[#171717]">
                      {social.handle}
                    </p>
                  </div>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 border border-[#171717] bg-white px-2.5 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.14em] text-[#171717] transition-colors hover:bg-[#171717] hover:text-white"
                  >
                    Visit
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {/* Social Embed Frame */}
                <div className="relative h-[420px] w-full bg-[#F7F4EE]/50 overflow-hidden">
                  <iframe
                    title={social.title}
                    src={social.embedUrl}
                    loading="lazy"
                    className="h-full w-full border-0"
                    allow="encrypted-media"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Grid: Map + Hours + Contact Form */}
      <section className="bg-paper-grain py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 items-start">
            {/* Left Column: Location Map & Hours */}
            <div className="lg:col-span-5 space-y-6">
              {/* Store Location with Embedded Google Map */}
              <div className="border border-[#171717] bg-white vintage-shadow-sm">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#171717] bg-[#171717] text-white">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-[#795548]">
                          Store Location
                        </h2>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#171717]/85">
                          {STORE_ADDRESS}
                        </p>
                      </div>
                    </div>
                  </div>

                  <a
                    href={GOOGLE_MAPS_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 border border-[#171717] bg-[#F7F4EE] px-3.5 py-2 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-[#171717] transition-colors hover:bg-[#171717] hover:text-white"
                  >
                    Open in Google Maps
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <div className="border-t border-[#171717] bg-[#E8DED2]">
                  <iframe
                    title="BGC Coffee Co. Store Location Map"
                    src={GOOGLE_MAPS_EMBED_URL}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-64 w-full border-0 grayscale-[0.15] contrast-[1.03]"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Store Hours */}
              <div className="border border-[#171717] bg-[#3B2923] p-6 text-[#F7F4EE] vintage-shadow-sm">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#E8DED2]/30 bg-[#171717] text-[#F7F4EE]">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-[#E8DED2]">
                      Store Hours
                    </h2>
                    <p className="mt-2 font-editorial text-xl text-white">
                      Monday to Friday: 10:00am - 6:00pm
                    </p>
                    <p className="mt-1.5 text-xs text-[#E8DED2]/75">
                      Closed during Public Holidays &amp; Class Suspensions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
