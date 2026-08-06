import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "white" | "soft" | "navy";
type Size = "md" | "lg" | "sm";

const variants: Record<Variant, string> = {
  primary: "bg-vt-red text-white hover:bg-vt-red-dark",
  secondary: "bg-transparent text-white ring-1 ring-white/25 hover:bg-white/8 hover:ring-white/40",
  ghost: "bg-transparent text-vt-navy ring-1 ring-vt-border hover:bg-vt-mist hover:ring-vt-border-strong",
  white: "bg-vt-paper text-vt-navy ring-1 ring-vt-border hover:bg-vt-mist",
  soft: "bg-vt-mist text-vt-navy ring-1 ring-vt-border hover:bg-vt-paper",
  navy: "bg-vt-navy text-white hover:bg-vt-navy-mid",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
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
    "inline-flex items-center justify-center gap-2 rounded-[4px] font-semibold tracking-[-0.01em] transition-[background-color,box-shadow,transform,border-color,color] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-red disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
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
