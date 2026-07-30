import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseGallery, CoursePurchasePanel } from "@/components/cart/course-purchase";
import { training } from "@/content/site";

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

  return (
    <section className="bg-[#fafafa] py-10 sm:py-14">
      <div className="container-vt px-5 sm:px-8 lg:px-10">
        <p className="text-sm text-vt-muted">
          Home / Store / eLearning / {course.title}
        </p>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <CourseGallery course={course} />
          <CoursePurchasePanel course={course} />
        </div>
      </div>
    </section>
  );
}
