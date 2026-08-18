"use client";

import Image, { type ImageProps } from "next/image";
import { useRef, useState } from "react";
import { useAdmin } from "@/components/admin/admin-provider";
import { normalizeImageSlot } from "@/lib/image-slots";
import { withBasePath } from "@/lib/paths";
import { cn } from "@/lib/utils";

type SiteImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

function AdminImageControls({
  slot,
  hasOverride,
}: {
  slot: string;
  hasOverride: boolean;
}) {
  const { replaceImage, resetImage } = useAdmin();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      await replaceImage(slot, file);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Could not replace image.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function onReset() {
    setBusy(true);
    try {
      await resetImage(slot);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Could not reset image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="pointer-events-none absolute inset-0 z-20">
      <span className="pointer-events-auto absolute right-2 top-2 flex gap-1 opacity-100 sm:opacity-0 sm:transition sm:group-hover/admin-img:opacity-100">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="rounded-md bg-vt-navy px-2 py-1 text-[11px] font-semibold text-white shadow-sm disabled:opacity-60"
        >
          {busy ? "Saving…" : "Replace"}
        </button>
        {hasOverride ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => void onReset()}
            className="rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-vt-ink shadow-sm ring-1 ring-vt-border disabled:opacity-60"
          >
            Reset
          </button>
        ) : null}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={(event) => void onFile(event.target.files?.[0])}
        />
      </span>
    </span>
  );
}

/** next/image wrapper that respects GitHub Pages basePath and admin replacements. */
export function SiteImage({ src, alt, className, fill, unoptimized, ...props }: SiteImageProps) {
  const { isAdmin, overrides } = useAdmin();
  const slot = normalizeImageSlot(src);
  const overrideSrc = overrides[slot];
  const resolved = overrideSrc ?? withBasePath(src);
  const editable = isAdmin && slot.startsWith("/");

  const image = (
    <Image
      src={resolved}
      alt={alt}
      fill={fill}
      unoptimized={unoptimized || Boolean(overrideSrc)}
      className={className}
      {...props}
    />
  );

  if (!editable) return image;

  return (
    <span className={cn("group/admin-img", fill ? "absolute inset-0 block" : "relative block")}>
      {image}
      <AdminImageControls slot={slot} hasOverride={Boolean(overrideSrc)} />
    </span>
  );
}
