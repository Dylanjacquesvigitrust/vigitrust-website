import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { KlaviyoScripts } from "@/components/analytics/klaviyo-scripts";
import { CartProvider } from "@/components/cart/cart-provider";
import { CatalogProvider } from "@/components/catalog/catalog-provider";
import { AdminProvider } from "@/components/admin/admin-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getPublishedCourses } from "@/lib/cms";
import { listImageOverrideUrls } from "@/lib/site-images";
import "./globals.css";

const sans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vigitrust.com"),
  title: {
    default: "VigiTrust | Integrated Risk Management & VigiOne GRC",
    template: "%s | VigiTrust",
  },
  description:
    "Award-winning Integrated Risk Management SaaS. VigiOne helps organisations in 120+ countries prepare for, validate & maintain continuous compliance.",
  icons: {
    icon: [
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon.png", type: "image/png", sizes: "64x64" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon-32.png"],
  },
  openGraph: {
    title: "VigiTrust | VigiOne GRC Platform",
    description:
      "Unify governance, risk, and compliance with VigiOne  -  assessments, evidence, training, and continuous monitoring.",
    type: "website",
    locale: "en_GB",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isAdmin, imageOverrides, courses] = await Promise.all([
    isAdminAuthenticated(),
    listImageOverrideUrls(),
    getPublishedCourses(),
  ]);

  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${sans.variable} h-full`}>
      <body className={`${sans.className} flex min-h-full flex-col antialiased`}>
        <KlaviyoScripts />
        <CatalogProvider courses={courses}>
          <CartProvider>
            <AdminProvider isAdmin={isAdmin} initialOverrides={imageOverrides}>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-vt-paper focus:px-4 focus:py-2 focus:text-vt-navy focus:shadow-[var(--shadow-md)]"
            >
              Skip to content
            </a>
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </AdminProvider>
        </CartProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
