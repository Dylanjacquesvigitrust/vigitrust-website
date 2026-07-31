import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock3, Star, Users } from "lucide-react";
import { CoursePurchasePanel } from "@/components/cart/course-purchase";
import { SiteImage } from "@/components/ui/site-image";
import { courseDetails, training } from "@/content/courses";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return training.courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = training.courses.find((c) => c.slug === slug);
  if (!course) return { title: "Course" };
  return { title: course.title, description: course.summary };
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = training.courses.find((c) => c.slug === slug);
  if (!course) notFound();
  const details = courseDetails(course);

  return (
    <section className="bg-vt-mist pb-16">
      <div className="border-b border-vt-border bg-vt-navy text-white">
        <div className="container-vt grid gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-14">
          <div>
            <p className="text-sm text-vt-cyan">
              <Link href="/training" className="hover:text-white">
                eLearning
              </Link>{" "}
              / {details.category}
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-vt-cyan">
              VigiTrust · {details.level}
            </p>
            <h1 className="type-display mt-3 text-balance text-white">{course.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90">{details.summary}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/85">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Star className="size-4 fill-vt-red text-vt-red" aria-hidden />
                {details.rating.toFixed(1)} course rating
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4 text-vt-cyan" aria-hidden />
                {details.learnersLabel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-4 text-vt-cyan" aria-hidden />
                {details.duration}
              </span>
            </div>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[12px] ring-1 ring-white/20">
            <SiteImage
              src={course.image}
              alt={course.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 40vw"
            />
          </div>
        </div>
      </div>

      <div className="container-vt px-5 sm:px-8 lg:px-10">
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-6">
            <article className="rounded-[12px] bg-vt-paper p-7 ring-1 ring-vt-border sm:p-8">
              <h2 className="type-h3 text-vt-ink">About this course</h2>
              <p className="mt-4 leading-relaxed text-vt-slate">{details.description}</p>
              <p className="mt-4 text-sm text-vt-muted">
                <span className="font-semibold text-vt-ink">Who it&apos;s for:</span> {details.audience}
              </p>
            </article>

            <article className="rounded-[12px] bg-vt-paper p-7 ring-1 ring-vt-border sm:p-8">
              <h2 className="type-h3 text-vt-ink">Skills you&apos;ll gain</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {details.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-[6px] bg-vt-red-soft px-3 py-1.5 text-sm font-medium text-vt-red"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </article>

            <article className="rounded-[12px] bg-vt-paper p-7 ring-1 ring-vt-border sm:p-8">
              <h2 className="type-h3 text-vt-ink">What you&apos;ll learn</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {details.learningOutcomes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-vt-slate">
                    <Check className="mt-0.5 size-4 shrink-0 text-vt-success" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            {course.modules ? (
              <article className="rounded-[12px] bg-vt-paper p-7 ring-1 ring-vt-border sm:p-8">
                <h2 className="type-h3 text-vt-ink">Syllabus</h2>
                <p className="mt-2 text-sm text-vt-muted">
                  Choose the module level that matches your audience. Prices shown per learner seat.
                </p>
                <div className="mt-6 space-y-4">
                  {course.modules.map((mod, index) => (
                    <details
                      key={mod.name}
                      className="group rounded-[10px] bg-vt-mist p-5 ring-1 ring-vt-border open:bg-vt-paper"
                      open={index === 0}
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                        <span className="font-semibold text-vt-ink">
                          {index + 1}. {mod.name}
                        </span>
                        <span className="text-sm font-bold text-vt-price">{mod.price}</span>
                      </summary>
                      <ul className="mt-4 space-y-2 border-t border-vt-border pt-4">
                        {mod.topics.map((topic) => (
                          <li key={topic} className="flex gap-2 text-sm text-vt-slate">
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-vt-red" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ))}
                </div>
              </article>
            ) : details.topics?.length ? (
              <article className="rounded-[12px] bg-vt-paper p-7 ring-1 ring-vt-border sm:p-8">
                <h2 className="type-h3 text-vt-ink">Topics covered</h2>
                <ul className="mt-4 space-y-2">
                  {details.topics.map((topic) => (
                    <li key={topic} className="flex gap-2 text-sm text-vt-slate">
                      <Check className="mt-0.5 size-4 shrink-0 text-vt-success" aria-hidden />
                      {topic}
                    </li>
                  ))}
                </ul>
              </article>
            ) : null}
          </div>

          <CoursePurchasePanel course={course} />
        </div>
      </div>
    </section>
  );
}
