import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "white" | "soft";
type Size = "md" | "lg" | "sm";

const variants: Record<Variant, string> = {
  primary:
    "bg-vt-red text-white hover:bg-vt-red-dark shadow-[0_10px_28px_-14px_rgba(196,30,58,0.65)]",
  secondary:
    "bg-white/10 text-white ring-1 ring-white/35 hover:bg-white/16",
  ghost:
    "bg-transparent text-vt-azure ring-1 ring-vt-border hover:bg-vt-mist hover:text-vt-navy",
  white:
    "bg-vt-paper text-vt-navy hover:bg-vt-mist shadow-sm",
  soft:
    "bg-[#e8e6f0] text-[#3d3558] hover:bg-[#ddd9ea]",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-[0.9375rem]",
};

type Common = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
};

type ButtonAsButton = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = Common & { href: string; type?: never };

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  href,
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-[6px] font-semibold tracking-wide transition duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-vt-red disabled:pointer-events-none disabled:opacity-55",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
