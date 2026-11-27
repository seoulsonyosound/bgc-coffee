import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#171717] text-[#F7F4EE] border-t-2 border-[#171717] mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 items-start">
          {/* Enlarged Official Logo Column */}
          <div className="flex items-center">
            <Link
              href="/"
              aria-label="b.g.c coffee co. Home"
              className="inline-flex items-center gap-4 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#795548]"
            >
              <span className="relative inline-flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/40 bg-white p-3 transition-transform duration-300 group-hover:rotate-[-4deg]">
                <Image
                  src="/images/bgc-logo.png"
                  alt="b.g.c coffee co. official logo"
                  width={96}
                  height={96}
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-editorial text-4xl tracking-tight lowercase text-white">
                  b.g.c
                </span>
                <span className="mt-1 font-display text-xs font-semibold tracking-[0.24em] lowercase text-[#E8DED2]/85">
                  coffee co.
                </span>
              </span>
            </Link>
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

          {/* Store & Hours */}
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#E8DED2] border-b border-white/15 pb-2">
              Store &amp; Hours
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#F7F4EE]/80">
              <li>
                803, 8th Ave., Del Pilar, City of San Fernando, Pampanga 2000
              </li>
              <li className="pt-1 font-medium text-white">
                Monday to Friday: 10:00am - 6:00pm
              </li>
              <li className="text-xs text-[#E8DED2]/65">
                Closed during Public Holidays &amp; Class Suspensions
              </li>
            </ul>
          </div>

          {/* Social & Admin */}
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.22em] text-[#E8DED2] border-b border-white/15 pb-2">
              Connect
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-[#F7F4EE]/80">
              <li>
                <a
                  href="mailto:bgccoffeeco@gmail.com"
                  aria-label="Email bgccoffeeco@gmail.com"
                  className="inline-flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[#E8DED2]" />
                  <span className="hover:underline underline-offset-4">
                    bgccoffeeco@gmail.com
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/bgccoffeeco"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook facebook.com/bgccoffeeco"
                  className="inline-flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4 shrink-0 text-[#E8DED2]"
                  >
                    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
                  </svg>
                  <span className="hover:underline underline-offset-4">
                    bgccoffeeco
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/bgccoffeeco"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram @bgccoffeeco"
                  className="inline-flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 shrink-0 text-[#E8DED2]"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span className="hover:underline underline-offset-4">
                    @bgccoffeeco
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@bgc.coffee.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok @bgc.coffee.co"
                  className="inline-flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4 shrink-0 text-[#E8DED2]"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.16z" />
                  </svg>
                  <span className="hover:underline underline-offset-4">
                    @bgc.coffee.co
                  </span>
                </a>
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
