"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  slug,
  label = "Add to basket",
  module,
  price,
  priceLabel,
  className,
  showViewCart,
}: {
  slug: string;
  label?: string;
  module?: string;
  price?: number;
  priceLabel?: string;
  className?: string;
  showViewCart?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center rounded-[6px] bg-vt-red px-4 py-2.5 text-sm font-semibold text-white transition duration-150 hover:bg-vt-red-dark focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-vt-red",
          className,
        )}
        onClick={() => {
          addItem(slug, { module, price, priceLabel });
          setAdded(true);
          window.setTimeout(() => setAdded(false), 2500);
        }}
      >
        {added ? "Added ✓" : label}
      </button>
      {added && showViewCart !== false ? (
        <Link href="/checkout" className="text-center text-xs font-semibold text-vt-red hover:underline">
          View basket / checkout →
        </Link>
      ) : null}
    </div>
  );
}
