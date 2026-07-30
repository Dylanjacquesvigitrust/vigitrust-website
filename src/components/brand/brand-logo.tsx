import Image from "next/image";
import Link from "next/link";
import { brand } from "@/content/layout";
import { cn } from "@/lib/utils";

/** Official VigiTrust wordmark from the provided brand PNG. */
export function BrandLogo({
  className,
  href = "/",
  priority = false,
}: {
  className?: string;
  href?: string;
  onDark?: boolean;
  priority?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("relative inline-flex h-8 w-[170px] items-center sm:h-9 sm:w-[196px]", className)}
      aria-label="VigiTrust home"
    >
      <Image
        src={brand.logo}
        alt="VigiTrust"
        fill
        priority={priority}
        unoptimized
        className="object-contain object-left"
        sizes="196px"
      />
    </Link>
  );
}
