import Link from "next/link";
import Image from "next/image";

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
            <ul className="mt-4 space-y-2.5 text-sm text-[#F7F4EE]/80">
              <li>
                Instagram:{" "}
                <a
                  href="https://instagram.com/bgccoffeeco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline underline-offset-4 transition-colors"
                >
                  @bgccoffeeco
                </a>
              </li>
              <li>
                TikTok:{" "}
                <a
                  href="https://www.tiktok.com/@bgc.coffee.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline underline-offset-4 transition-colors"
                >
                  @bgc.coffee.co
                </a>
              </li>
              <li>
                Facebook:{" "}
                <a
                  href="https://facebook.com/bgccoffeeco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline underline-offset-4 transition-colors"
                >
                  facebook.com/bgccoffeeco
                </a>
              </li>
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
