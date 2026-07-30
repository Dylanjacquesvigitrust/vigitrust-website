import { type ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  body,
  tone = "light",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-3xl text-center", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "type-eyebrow mb-3",
            tone === "dark" ? "text-vt-cyan" : "text-vt-red",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 className={cn("type-h2 text-balance", tone === "dark" ? "text-white" : "text-vt-ink")}>
        {title}
      </h2>
      {body ? (
        <p
          className={cn(
            "mt-4 max-w-3xl type-body-lg",
            tone === "dark" ? "text-vt-on-dark/90" : "text-vt-muted",
            align === "center" && "mx-auto",
          )}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  body,
  children,
  compact,
  image,
  videoLabel,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  children?: ReactNode;
  compact?: boolean;
  image?: string;
  /** Optional media-rail label for a video placeholder. */
  videoLabel?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden navy-surface",
        compact ? "py-14 md:py-16" : "py-16 md:py-24",
      )}
    >
      {image && !videoLabel ? (
        <>
          <Image src={image} alt="" fill priority quality={75} className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(8,24,40,0.92),rgba(18,58,86,0.78))]" />
        </>
      ) : null}
      <div className="absolute inset-0 network-grid opacity-20" aria-hidden />
      <div
        className={cn(
          "container-vt relative px-5 sm:px-8 lg:px-10",
          (image || videoLabel) && "grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end",
        )}
      >
        <div>
          {eyebrow ? <p className="type-eyebrow mb-3 text-vt-cyan">{eyebrow}</p> : null}
          <h1 className="type-display max-w-4xl text-balance text-white">{title}</h1>
          {body ? <p className="mt-5 max-w-2xl type-body-lg text-vt-on-dark/90">{body}</p> : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
        {videoLabel ? (
          <div className="relative aspect-video overflow-hidden rounded-[12px] ring-1 ring-white/20">
            {image ? (
              <Image src={image} alt="" fill className="object-cover" sizes="(max-width:1024px) 100vw, 40vw" />
            ) : (
              <div className="absolute inset-0 bg-vt-navy-mid" />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-vt-navy/55 p-6 text-center">
              <span
                className="grid size-14 place-items-center rounded-full bg-vt-red text-white shadow-[var(--shadow-soft)]"
                aria-hidden
              >
                <svg viewBox="0 0 24 24" className="size-6 translate-x-0.5" fill="currentColor">
                  <path d="M8 5.14v13.72L19 12 8 5.14Z" />
                </svg>
              </span>
              <p className="text-sm font-semibold text-white">{videoLabel}</p>
              <p className="text-xs text-vt-on-dark/75">Video placeholder</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function MediaPlaceholder({
  image,
  label,
  aspect = "video",
  className,
}: {
  image?: string;
  label: string;
  aspect?: "video" | "photo";
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-[12px] bg-vt-mist ring-1 ring-vt-border",
        aspect === "video" ? "aspect-video" : "aspect-[4/3]",
        className,
      )}
    >
      {image ? (
        <Image src={image} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
      ) : null}
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-vt-navy/85 to-transparent px-5 py-4">
        <p className="text-sm font-semibold text-white">{label}</p>
      </figcaption>
    </figure>
  );
}

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
