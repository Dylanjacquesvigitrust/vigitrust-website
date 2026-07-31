import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, Star } from "lucide-react";
import { SiteImage } from "@/components/ui/site-image";
import { courseDetails, training } from "@/content/courses";

export const metadata: Metadata = {
  title: "eLearning Catalogue",
  description:
    "Browse VigiTrust eLearning courses  -  GDPR, PCI, HIPAA, Secure Coding, phishing awareness and 200+ learning modules.",
};

export default function TrainingPage() {
  const courses = training.courses;

  return (
    <>
      <section className="border-b border-vt-border bg-vt-navy text-white">
        <div className="container-vt px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
          <p className="type-eyebrow text-vt-cyan">{training.hero.eyebrow}</p>
          <h1 className="type-h2 mt-3 text-white">{training.hero.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg">
            {training.hero.body}
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-vt-cyan">
            <strong className="text-white">{training.saaas.title}</strong>  -  {training.saaas.body}
          </p>
        </div>
      </section>

      <section className="bg-vt-mist py-12 sm:py-16" id="catalogue">
        <div className="container-vt px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 border-b border-vt-border pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="type-h2 text-vt-ink">{training.catalogueHeading}</h2>
              <p className="mt-2 max-w-2xl text-vt-muted">{training.catalogueSub}</p>
            </div>
            <p className="type-meta text-vt-muted">
              Showing {courses.length} of {courses.length} courses
            </p>
          </div>

          <div className="mt-10 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => {
              const details = courseDetails(course);
              return (
                <article
                  key={course.slug}
                  className="card-lift group flex h-full flex-col overflow-hidden rounded-[12px] bg-vt-paper ring-1 ring-vt-border"
                >
                  <Link href={`/training/${course.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-vt-mist">
                    <SiteImage
                      src={course.image}
                      alt={course.title}
                      fill
                      quality={70}
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                    <span className="absolute left-3 top-3 rounded-[4px] bg-vt-navy/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
                      {details.category}
                    </span>
                  </Link>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-vt-red">
                      VigiTrust · {details.level}
                    </p>
                    <h3 className="mt-2 text-lg font-bold leading-snug text-vt-ink">
                      <Link href={`/training/${course.slug}`} className="transition hover:text-vt-red">
                        {course.title}
                      </Link>
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-vt-slate">
                      {course.summary}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {details.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-[4px] bg-vt-mist px-2 py-1 text-[11px] font-medium text-vt-azure ring-1 ring-vt-border"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-vt-border pt-4 text-xs text-vt-muted">
                      <span className="inline-flex items-center gap-1 font-semibold text-vt-ink">
                        <Star className="size-3.5 fill-vt-red text-vt-red" aria-hidden />
                        {details.rating.toFixed(1)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="size-3.5" aria-hidden />
                        {details.duration}
                      </span>
                      <span>{details.learnersLabel}</span>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-base font-bold text-vt-price">{course.priceLabel}</p>
                      <Link
                        href={`/training/${course.slug}`}
                        className="inline-flex items-center justify-center rounded-[6px] bg-vt-red px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-vt-red-dark"
                      >
                        View course
                      </Link>
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
