import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types/order";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "brown"
    | "dark"
    | "success"
    | "warning"
    | "danger"
    | "info";
  className?: string;
}

const VARIANT_CLASSES: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-[#F7F4EE] text-[#171717] border border-[#171717]/30",
  brown: "bg-[#E8DED2] text-[#3B2923] border border-[#795548]/40",
  dark: "bg-[#171717] text-white border border-[#171717]",
  success: "bg-[#F7F4EE] text-[#3B2923] border border-[#3B2923]",
  warning: "bg-[#E8DED2]/80 text-[#795548] border border-[#795548]",
  danger: "bg-white text-[#171717] border border-[#171717] line-through decoration-[#795548]",
  info: "bg-white text-[#171717] border border-[#171717]/40",
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 font-display text-[11px] font-semibold uppercase tracking-[0.12em]",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function getOrderStatusVariant(
  status: OrderStatus
): NonNullable<BadgeProps["variant"]> {
  switch (status) {
    case "Pending":
      return "warning";
    case "Confirmed":
      return "info";
    case "Preparing":
      return "brown";
    case "Ready for Pickup":
      return "dark";
    case "Completed":
      return "success";
    case "Cancelled":
      return "danger";
    default:
      return "default";
  }
}
