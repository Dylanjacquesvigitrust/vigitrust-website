import { Globe2, Binary, Activity, UserRound } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** Framed product screenshot for VigiOne Platform pages only. */
export function ProductShot({
  src,
  alt,
  className,
  priority,
  contain,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  contain?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[14px] bg-vt-paper shadow-[var(--shadow-soft)] ring-1 ring-vt-border",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={614}
        priority={priority}
        quality={75}
        className={cn("h-auto w-full", contain ? "object-contain" : "object-cover object-top")}
        sizes="(max-width:768px) 100vw, (max-width:1280px) 70vw, 900px"
      />
    </div>
  );
}

export function HeroOrbit() {
  const satellites = [
    { Icon: Activity, className: "left-[6%] top-[16%]" },
    { Icon: UserRound, className: "right-[4%] top-[20%]" },
    { Icon: Globe2, className: "left-[0%] bottom-[26%]" },
    { Icon: Binary, className: "right-[8%] bottom-[18%]" },
  ];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[480px]" aria-hidden>
      <div className="absolute inset-[6%] rounded-full border border-dashed border-white/25" />
      <div className="absolute inset-[18%] rounded-full border border-white/15" />
      <div className="absolute inset-0 animate-[spin_48s_linear_infinite] motion-reduce:animate-none">
        {satellites.map(({ Icon, className }) => (
          <span
            key={className}
            className={`absolute grid size-12 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-sm ${className}`}
          >
            <Icon className="size-5" />
          </span>
        ))}
      </div>
      <div className="absolute inset-[26%] grid place-items-center drop-shadow-[0_16px_36px_-12px_rgba(190,39,45,0.85)]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="size-full"
          aria-hidden
        >
          <defs>
            <mask id="vt-orbit-mark-mask">
              <circle cx="50" cy="50" r="48" fill="#fff" />
              <path d="M18 50h64" stroke="#000" strokeWidth="7.5" strokeLinecap="round" />
              <path
                d="M16 34c18-8 38-9 55-2 7 3 13 7 17 12"
                stroke="#000"
                strokeWidth="7.5"
                strokeLinecap="round"
              />
              <path
                d="M16 66c18 8 38 9 55 2 7-3 13-7 17-12"
                stroke="#000"
                strokeWidth="7.5"
                strokeLinecap="round"
              />
            </mask>
          </defs>
          <circle cx="50" cy="50" r="48" fill="#C41E3A" mask="url(#vt-orbit-mark-mask)" />
        </svg>
      </div>
    </div>
  );
}
