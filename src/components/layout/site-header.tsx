"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, ShoppingCart, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { navigation } from "@/content/layout";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "border-b border-vt-border bg-vt-paper/90 backdrop-blur-md transition-[box-shadow] duration-200",
          scrolled && "shadow-[var(--shadow-xs)]",
        )}
      >
        <div className="container-vt flex h-14 items-center justify-between gap-4 px-5 sm:h-16 sm:px-8 lg:px-10">
          <BrandLogo priority />

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
            {navigation.primary.map((item) => {
              const isOpen = activeMenu === item.label;
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}`)) ||
                (item.href === "/training" && pathname.startsWith("/training"));
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(item.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-2 text-[13px] font-medium text-vt-slate transition hover:text-vt-navy",
                      active && "text-vt-navy",
                    )}
                    aria-expanded={item.children ? isOpen : undefined}
                    aria-haspopup={item.children ? "menu" : undefined}
                  >
                    {item.label}
                    {item.children ? <ChevronDown className="size-3.5 opacity-50" aria-hidden /> : null}
                  </Link>
                  {active ? (
                    <span className="absolute inset-x-2.5 -bottom-px h-px bg-vt-red" aria-hidden />
                  ) : null}
                  {item.children && isOpen ? (
                    <div className="absolute left-0 top-full z-50 w-[20rem] pt-2" role="menu">
                      <div className="overflow-hidden rounded-[6px] border border-vt-border bg-vt-paper p-1 shadow-[var(--shadow-soft)]">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            role="menuitem"
                            className="block rounded-[4px] px-3 py-2.5 transition hover:bg-vt-mist"
                          >
                            <div className="text-sm font-semibold text-vt-ink">{child.label}</div>
                            {"description" in child && child.description ? (
                              <div className="mt-0.5 text-xs leading-snug text-vt-muted">
                                {child.description}
                              </div>
                            ) : null}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/checkout"
              className="relative inline-flex rounded-[4px] p-2 text-vt-slate transition hover:bg-vt-mist hover:text-vt-navy"
              aria-label={`Shopping cart${count ? `, ${count} items` : ""}`}
            >
              <ShoppingCart className="size-[18px]" aria-hidden />
              {count > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-[3px] bg-vt-red px-1 text-[10px] font-bold leading-4 text-white">
                  {count}
                </span>
              ) : null}
            </Link>
            <Button href={navigation.cta.href} size="sm" className="hidden sm:inline-flex">
              {navigation.cta.label}
            </Button>
            <button
              type="button"
              className="inline-flex rounded-[4px] p-2 text-vt-navy transition hover:bg-vt-mist xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </div>

        {open ? (
          <div id="mobile-nav" className="border-t border-vt-border bg-vt-paper xl:hidden">
            <div className="container-vt space-y-1 px-5 py-4 sm:px-8">
              {navigation.primary.map((item) => (
                <div key={item.label} className="border-b border-vt-border py-2 last:border-0">
                  <Link href={item.href} className="block py-1.5 text-[15px] font-semibold text-vt-ink">
                    {item.label}
                  </Link>
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block py-1.5 pl-3 text-sm text-vt-muted"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
              <Button href={navigation.cta.href} className="mt-3 w-full">
                {navigation.cta.label}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
