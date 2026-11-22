import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandWordmarkProps {
  variant?: "light" | "dark";
  href?: string;
  className?: string;
  showSubtext?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Official BGC Coffee Co. Logo & Wordmark component.
 * Renders the exact official `/images/bgc-logo.png` illustration inside a
 * circular white emblem with generous padding so no part of the artwork clips.
 */
export function BrandWordmark({
  variant = "dark",
  href = "/",
  className,
  showSubtext = true,
  size = "md",
}: BrandWordmarkProps) {
  const isLight = variant === "light";

  const emblemSizes = {
    sm: "h-10 w-10 p-1.5",
    md: "h-12 w-12 p-1.5",
    lg: "h-16 w-16 p-2",
  };

  const imagePixelSize = {
    sm: 40,
    md: 48,
    lg: 64,
  }[size];

  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-3 select-none group",
        className
      )}
    >
      {/* Circular Official Logo Emblem */}
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border bg-white transition-transform duration-300 group-hover:rotate-[-4deg]",
          emblemSizes[size],
          isLight ? "border-white/40" : "border-[#171717]"
        )}
      >
        <Image
          src="/images/bgc-logo.png"
          alt="b.g.c coffee co. official logo"
          width={imagePixelSize}
          height={imagePixelSize}
          priority
          className="h-full w-full object-contain"
        />
      </span>

      {/* Brand Wordmark */}
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-editorial tracking-tight lowercase",
            size === "lg" ? "text-2xl" : size === "sm" ? "text-lg" : "text-xl",
            isLight ? "text-white" : "text-[#171717]"
          )}
        >
          b.g.c
        </span>
        {showSubtext && (
          <span
            className={cn(
              "mt-0.5 font-display text-[10px] font-semibold tracking-[0.22em] lowercase",
              isLight ? "text-[#E8DED2]/85" : "text-[#795548]"
            )}
          >
            coffee co.
          </span>
        )}
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#795548] rounded-sm"
      aria-label="b.g.c coffee co. Home"
    >
      {content}
    </Link>
  );
}
