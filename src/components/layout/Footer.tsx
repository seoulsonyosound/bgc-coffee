import Link from "next/link";
import { BrandWordmark } from "@/components/ui/BrandWordmark";

export function Footer() {
  return (
    <footer className="bg-[#171717] text-[#F7F4EE] border-t-2 border-[#171717] mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <BrandWordmark variant="light" href="/" size="lg" showSubtext />
            <p className="text-sm leading-relaxed text-[#E8DED2]/75 max-w-xs">
              A little comfort in every cup. Vintage-inspired specialty coffee
              brewed fresh daily for seamless counter pickup.
            </p>
            <p className="inline-block border border-[#E8DED2]/30 px-2.5 py-1 font-display text-[10px] uppercase tracking-[0.2em] text-[#E8DED2]">
              Est. Independent Coffee Culture
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#E8DED2] border-b border-white/15 pb-2">
              Catalog
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#F7F4EE]/75">
              <li>
                <Link
                  href="/"
                  className="hover:text-white hover:underline underline-offset-4 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="hover:text-white hover:underline underline-offset-4 transition-colors"
                >
                  Coffee Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white hover:underline underline-offset-4 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white hover:underline underline-offset-4 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-white hover:underline underline-offset-4 transition-colors"
                >
                  Shopping Bag
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Placeholders */}
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#E8DED2] border-b border-white/15 pb-2">
              Store &amp; Hours
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#F7F4EE]/75">
              <li>[Store Location Placeholder — Metro Manila, PH]</li>
              <li>[Phone Placeholder — (02) 8000-0000]</li>
              <li>[Email Placeholder — hello@bgccoffee.example]</li>
              <li className="text-[#E8DED2]/60">
                Daily: [Hours Placeholder — 7:00 AM – 10:00 PM]
              </li>
            </ul>
          </div>

          {/* Social & Admin */}
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#E8DED2] border-b border-white/15 pb-2">
              Connect
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#F7F4EE]/75">
              <li>Instagram: [@bgccoffee.placeholder]</li>
              <li>Facebook: [fb.com/bgccoffee.placeholder]</li>
              <li>TikTok: [@bgccoffee.placeholder]</li>
              <li className="pt-3">
                <Link
                  href="/admin/login"
                  className="inline-block border border-[#E8DED2]/35 px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E8DED2] hover:bg-[#795548] hover:border-[#795548] hover:text-white transition-colors"
                >
                  Staff &amp; Admin Portal →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/15 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8DED2]/60 font-display tracking-wide">
          <p>© 2026 b.g.c coffee co. All rights reserved.</p>
          <p>
            Made with {"<3"} by Friends of BGC - Alejos, Dela Peña, Pastoral,
            Garcia | UA-BSIT4A &apos;2627
          </p>
        </div>
      </div>
    </footer>
  );
}
