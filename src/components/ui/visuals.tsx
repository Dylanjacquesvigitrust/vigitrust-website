import { Globe2, Binary, Activity, UserRound } from "lucide-react";
import { SiteImage } from "@/components/ui/site-image";
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
        "relative overflow-hidden rounded-[6px] bg-vt-paper shadow-[var(--shadow-soft)] ring-1 ring-vt-border",
        className,
      )}
    >
      <SiteImage
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
    { Icon: Activity, className: "left-[8%] top-[18%]" },
    { Icon: UserRound, className: "right-[6%] top-[22%]" },
    { Icon: Globe2, className: "left-[2%] bottom-[28%]" },
    { Icon: Binary, className: "right-[10%] bottom-[20%]" },
  ];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]" aria-hidden>
      <div className="absolute inset-[8%] rounded-full border border-white/10" />
      <div className="absolute inset-[20%] rounded-full border border-dashed border-white/15" />
      <div className="absolute inset-0 animate-[spin_64s_linear_infinite] motion-reduce:animate-none">
        {satellites.map(({ Icon, className }) => (
          <span
            key={className}
            className={`absolute grid size-10 place-items-center rounded-[4px] border border-white/15 bg-white/5 text-white/90 backdrop-blur-[2px] ${className}`}
          >
            <Icon className="size-4" strokeWidth={1.75} />
          </span>
        ))}
      </div>
      <div className="absolute inset-[28%] grid place-items-center">
        <SiteImage
          src="/brand/vigitrust-icon.png"
          alt=""
          width={280}
          height={280}
          priority
          unoptimized
          className="size-full object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
        />
      </div>
    </div>
  );
}
