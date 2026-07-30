import type { Metadata } from "next";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { SiteImage } from "@/components/ui/site-image";
import { training } from "@/content/site";

export const metadata: Metadata = {
  title: "Training & Certifications | eLearning Store",
  description:
    "Buy VigiTrust eLearning courses  -  GDPR, PCI, CCPA, Secure Coding, phishing awareness and more.",
};

export default function TrainingPage() {
  const courses = training.courses;

  return (
    <>
      <section className="border-b border-vt-border bg-vt-paper">
        <div className="container-vt px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
          <p className="type-meta text-vt-muted">Home / Store / eLearning</p>
          <h1 className="type-h2 mt-3 text-vt-ink">{training.hero.title}</h1>
          <div className="mt-5 max-w-4xl space-y-4 leading-relaxed text-vt-slate">
            <p>{training.hero.body}</p>
            <p>
              <strong className="text-vt-ink">{training.saaas.title}</strong>  -  {training.saaas.body}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-vt-mist py-12 sm:py-16" id="catalogue">
        <div className="container-vt px-5 sm:px-8 lg:px-10">
          <h2 className="type-h2 text-vt-ink">{training.catalogueHeading}</h2>
          <p className="mt-2 text-vt-muted">{training.catalogueSub}</p>

          <div className="mt-8 flex flex-col gap-3 border-b border-vt-border pb-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="type-meta text-vt-muted">
              Showing 1 - {courses.length} of {courses.length} results
            </p>
            <label className="flex items-center gap-2 text-sm text-vt-slate">
              <span className="sr-only">Sort</span>
              <select
                className="rounded-[6px] border border-vt-border bg-vt-paper px-3 py-2 text-sm"
                defaultValue="latest"
                aria-label="Sort courses"
              >
                <option value="latest">Sort by latest</option>
                <option value="price-asc">Sort by price: low to high</option>
                <option value="price-desc">Sort by price: high to low</option>
                <option value="title">Sort by name</option>
              </select>
            </label>
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const needsOptions = course.cta === "Select options" || Boolean(course.modules);
              return (
                <article key={course.slug} className="card-lift flex flex-col bg-vt-paper">
                  <Link
                    href={`/training/${course.slug}`}
                    className="relative block aspect-[4/3] overflow-hidden bg-vt-mist"
                  >
                    <SiteImage
                      src={course.image}
                      alt={course.title}
                      fill
                      quality={70}
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col px-1 pt-4">
                    <h3 className="text-lg font-bold text-vt-ink">
                      <Link href={`/training/${course.slug}`} className="hover:text-vt-red">
                        {course.title}
                      </Link>
                    </h3>
                    <p className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-vt-muted">
                      {course.summary}
                    </p>
                    <p className="mt-4 text-base font-semibold text-vt-price">{course.priceLabel}</p>
                    <div className="mt-3">
                      {needsOptions ? (
                        <Link
                          href={`/training/${course.slug}`}
                          className="inline-flex w-full items-center justify-center rounded-[6px] bg-[#e8e6f0] px-4 py-2.5 text-sm font-semibold text-[#3d3558] transition hover:bg-[#ddd9ea]"
                        >
                          Select options
                        </Link>
                      ) : (
                        <AddToCartButton slug={course.slug} label="Add to basket" />
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
