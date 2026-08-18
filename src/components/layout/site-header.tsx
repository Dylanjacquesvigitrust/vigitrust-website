"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, ShoppingCart, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { useAdmin } from "@/components/admin/admin-provider";
import { navigation } from "@/content/layout";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const { isAdmin } = useAdmin();
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
    <header className="sticky top-0 z-50 border-b border-vt-border bg-[color:var(--background)]/95 backdrop-blur-md">
      <div
        className={cn(
          "transition-[box-shadow] duration-200",
          scrolled && "shadow-[var(--shadow-xs)]",
        )}
      >
        <div className="container-wide grid h-14 grid-cols-[auto_1fr_auto] items-center gap-4 px-5 sm:h-14 sm:px-8 lg:px-10">
          <BrandLogo priority className="h-7 w-[148px] sm:h-8 sm:w-[168px]" />

          <nav className="hidden items-center justify-center gap-0.5 lg:flex" aria-label="Primary">
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
                      "inline-flex h-9 items-center gap-1 px-2.5 text-[13px] font-medium text-vt-slate transition duration-200 hover:text-vt-ink",
                      active && "text-vt-ink",
                    )}
                    aria-expanded={item.children ? isOpen : undefined}
                    aria-haspopup={item.children ? "menu" : undefined}
                  >
                    {item.label}
                    {item.children ? <ChevronDown className="size-3.5 opacity-45" aria-hidden /> : null}
                  </Link>
                  {item.children && isOpen ? (
                    <div className="absolute left-1/2 top-full z-50 w-[20rem] -translate-x-1/2 pt-2" role="menu">
                      <div className="overflow-hidden rounded-xl border border-vt-border bg-vt-paper p-1.5 shadow-[var(--shadow-soft)]">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            role="menuitem"
                            className="block rounded-lg px-3 py-2.5 transition duration-200 hover:bg-vt-mist"
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

          <div className="flex items-center justify-end gap-2">
            {isAdmin ? (
              <Link
                href="/admin/renewal-codes"
                className="inline-flex h-8 items-center rounded-md bg-vt-navy px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white"
              >
                Admin
              </Link>
            ) : null}
            <Link
              href="/checkout"
              className="relative inline-flex size-9 items-center justify-center rounded-lg text-vt-slate transition duration-200 hover:bg-vt-mist hover:text-vt-ink"
              aria-label={`Shopping cart${count ? `, ${count} items` : ""}`}
            >
              <ShoppingCart className="size-4" aria-hidden />
              {count > 0 ? (
                <span className="absolute right-1 top-1 grid min-w-3.5 place-items-center rounded bg-vt-red px-0.5 text-[9px] font-bold leading-3 text-white">
                  {count}
                </span>
              ) : null}
            </Link>
            <Button
              href={navigation.cta.href}
              variant="header"
              size="sm"
              className="hidden h-8 px-3 text-[12px] font-semibold tracking-[-0.01em] sm:inline-flex"
            >
              {navigation.cta.label}
            </Button>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-lg text-vt-ink transition duration-200 hover:bg-vt-mist lg:hidden"
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
          <div id="mobile-nav" className="border-t border-vt-border bg-[color:var(--background)] lg:hidden">
            <div className="container-wide space-y-1 px-5 py-4 sm:px-8">
              {navigation.primary.map((item) => (
                <div key={item.label} className="border-b border-vt-border py-2 last:border-0">
                  <Link href={item.href} className="block py-1.5 text-[15px] font-semibold text-vt-ink">
                    {item.label}
                  </Link>
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block py-1.5 pl-3 text-sm text-vt-muted transition hover:text-vt-ink"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
              {isAdmin ? (
                <Link
                  href="/admin/renewal-codes"
                  className="mt-3 inline-flex h-10 items-center justify-center rounded-lg bg-vt-navy px-3 text-sm font-semibold text-white"
                >
                  Admin
                </Link>
              ) : null}
              <Button href={navigation.cta.href} variant="header" className="mt-3 w-full" size="md">
                {navigation.cta.label}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
