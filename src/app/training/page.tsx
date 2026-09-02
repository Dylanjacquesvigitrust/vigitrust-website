import type { Metadata } from "next";
import Link from "next/link";
import { Clock3 } from "lucide-react";
import { AdminAddCourseForm, AdminRemoveButton } from "@/components/admin/content-forms";
import { SiteImage } from "@/components/ui/site-image";
import { getPublishedCourses } from "@/lib/cms";
import { courseDetails, training } from "@/content/courses";

export const metadata: Metadata = {
  title: "eLearning Catalogue",
  description:
    "Browse VigiTrust eLearning courses — GDPR, PCI DSS, Cybersecurity Fundamentals, Secure Coding, and more.",
};

export default async function TrainingPage() {
  const courses = await getPublishedCourses();

  return (
    <>
      <section className="hero-wash border-b border-vt-border">
        <div className="container-wide px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <p className="type-eyebrow text-vt-red">{training.hero.eyebrow}</p>
          <h1 className="type-h2 mt-3 max-w-3xl text-vt-ink">{training.hero.title}</h1>
          <p className="mt-5 max-w-2xl type-body-lg text-vt-slate">
            {training.hero.body}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-vt-muted">
            <strong className="text-vt-ink">{training.saaas.title}</strong>  -  {training.saaas.body}
          </p>
        </div>
      </section>

      <section className="bg-vt-paper py-14 sm:py-20" id="catalogue">
        <div className="container-vt px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-3 border-b border-vt-border pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="type-h2 text-vt-ink">{training.catalogueHeading}</h2>
              <p className="mt-2 max-w-xl text-vt-muted">{training.catalogueSub}</p>
            </div>
            <p className="type-meta text-vt-muted">
              {courses.length} courses
            </p>
          </div>

          <AdminAddCourseForm />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => {
              const details = courseDetails(course);
              return (
                <article
                  key={course.slug}
                  className="card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-vt-border bg-vt-paper shadow-[var(--shadow-xs)]"
                >
                  <AdminRemoveButton kind="course" slug={course.slug} label={course.title} />
                  <Link
                    href={`/training/${course.slug}`}
                    className="relative block aspect-[16/9] overflow-hidden bg-vt-mist"
                  >
                    <SiteImage
                      src={course.image}
                      alt={course.title}
                      fill
                      quality={70}
                      className="object-cover transition duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                    <span className="absolute left-3 top-3 rounded-[6px] bg-vt-navy/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-white">
                      {details.category}
                    </span>
                  </Link>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-vt-red">
                      VigiTrust · {details.level}
                    </p>
                    <h3 className="mt-2 text-[1.0625rem] font-semibold leading-snug tracking-[-0.02em] text-vt-ink">
                      <Link href={`/training/${course.slug}`} className="transition hover:text-vt-red">
                        {course.title}
                      </Link>
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-vt-slate">
                      {course.summary}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {details.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-[6px] border border-vt-border bg-vt-mist px-2 py-0.5 text-[11px] font-medium text-vt-azure"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-vt-border pt-4 text-xs text-vt-muted">
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="size-3" aria-hidden />
                        {details.duration}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold tracking-[-0.01em] text-vt-navy">
                        {course.priceLabel}
                      </p>
                      <Link
                        href={`/training/${course.slug}`}
                        className="inline-flex h-9 items-center justify-center rounded-[8px] bg-vt-navy px-3 text-[13px] font-semibold text-white transition duration-200 hover:bg-vt-navy-mid"
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
