import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "white" | "soft" | "navy" | "header";
type Size = "md" | "lg" | "sm";

const variants: Record<Variant, string> = {
  primary: "bg-vt-red text-white hover:bg-vt-red-dark",
  secondary: "bg-vt-navy text-white hover:bg-vt-navy-mid",
  ghost:
    "bg-transparent text-vt-ink ring-1 ring-inset ring-vt-border-strong hover:bg-vt-paper hover:ring-vt-navy/25",
  white: "bg-vt-paper text-vt-ink ring-1 ring-inset ring-vt-border hover:bg-vt-mist",
  soft: "bg-vt-mist text-vt-ink hover:bg-vt-paper ring-1 ring-inset ring-vt-border",
  navy: "bg-vt-navy text-white hover:bg-vt-navy-mid",
  header:
    "bg-vt-navy text-white hover:bg-vt-navy-mid shadow-none ring-0",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-[15px]",
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

function isExternal(href: string) {
  return /^https?:\/\//i.test(href) || href.startsWith("//");
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  href,
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-[-0.015em] transition-[background-color,box-shadow,transform,color,border-color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-red disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    if (isExternal(href)) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
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
