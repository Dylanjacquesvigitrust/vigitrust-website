import { getPublishedCourses } from "@/lib/cms";
import { type Course } from "@/content/courses";

export const VAT_RATE = 0.23;

export type CheckoutLineItem = {
  slug: string;
  module?: string;
  quantity: number;
};

export type CheckoutCustomer = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  company?: string;
  country: string;
  address: string;
  city: string;
  county?: string;
  postcode: string;
};

export type ValidatedCartLine = {
  slug: string;
  module?: string;
  title: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type ValidatedCart = {
  lines: ValidatedCartLine[];
  subtotal: number;
  vat: number;
  total: number;
};

function courseUnitPrice(course: Course, moduleName?: string): number {
  if (moduleName && course.modules) {
    const mod = course.modules.find((m) => m.name === moduleName);
    if (mod) {
      return Number(mod.price.replace(/[^\d.]/g, "")) || 0;
    }
  }
  if (typeof course.priceFrom === "number") {
    return course.priceFrom;
  }
  const match = course.priceLabel.match(/€[\d,]+\.?\d*/);
  if (match) {
    return Number(match[0].replace(/[^\d.]/g, "")) || 0;
  }
  return 0;
}

/** Recompute cart totals server-side so client prices cannot be tampered with. */
export async function validateCart(items: CheckoutLineItem[]): Promise<ValidatedCart> {
  if (!items.length) {
    throw new Error("Your basket is empty.");
  }

  const courses = await getPublishedCourses();

  const lines: ValidatedCartLine[] = items.map((item) => {
    if (!item.slug || item.quantity < 1 || item.quantity > 99) {
      throw new Error("Invalid basket item.");
    }

    const course = courses.find((c) => c.slug === item.slug);
    if (!course) {
      throw new Error(`Unknown course: ${item.slug}`);
    }

    const unitPrice = courseUnitPrice(course, item.module);
    if (unitPrice <= 0) {
      throw new Error(`Pricing is not available for ${course.title}.`);
    }

    const title = item.module ? `${course.title} — ${item.module}` : course.title;

    return {
      slug: item.slug,
      module: item.module,
      title,
      quantity: item.quantity,
      unitPrice,
      lineTotal: Math.round(unitPrice * item.quantity * 100) / 100,
    };
  });

  const subtotal = Math.round(lines.reduce((sum, l) => sum + l.lineTotal, 0) * 100) / 100;
  const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
  const total = Math.round((subtotal + vat) * 100) / 100;

  return { lines, subtotal, vat, total };
}

export function eurosToCents(amount: number): number {
  return Math.round(amount * 100);
}
