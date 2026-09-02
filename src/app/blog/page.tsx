import type { Metadata } from "next";
import Link from "next/link";
import { AdminAddPostForm, AdminRemoveButton } from "@/components/admin/content-forms";
import { PageHero } from "@/components/ui/section";
import { SiteImage } from "@/components/ui/site-image";
import { getPublishedPosts } from "@/lib/cms";
import { blog } from "@/content/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog & News",
  description: blog.hero.body,
};

type Props = { searchParams: Promise<{ category?: string }> };

export default async function BlogPage({ searchParams }: Props) {
  const { category: categoryParam } = await searchParams;
  const category =
    categoryParam === "News" || categoryParam === "Blog" ? categoryParam : "All";
  const posts = await getPublishedPosts();
  const filtered =
    category === "All" ? posts : posts.filter((post) => post.category === category);

  const tabs = [
    { label: "All", value: "All", count: posts.length },
    { label: "News", value: "News", count: posts.filter((p) => p.category === "News").length },
    { label: "Blog", value: "Blog", count: posts.filter((p) => p.category === "Blog").length },
  ] as const;

  return (
    <>
      <PageHero eyebrow={blog.hero.eyebrow} title={blog.hero.title} body={blog.hero.body} compact />
      <section className="section-pad">
        <div className="container-vt">
          <AdminAddPostForm />
          <div className="mb-8 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <Link
                key={tab.value}
                href={tab.value === "All" ? "/blog" : `/blog?category=${tab.value}`}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-semibold transition",
                  category === tab.value
                    ? "bg-vt-navy text-white"
                    : "bg-vt-mist text-vt-slate ring-1 ring-vt-border hover:bg-vt-paper",
                )}
              >
                {tab.label}
                <span className="ml-2 opacity-70">{tab.count}</span>
              </Link>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group card-lift relative flex h-full flex-col overflow-hidden rounded-[10px] bg-vt-paper ring-1 ring-vt-border"
              >
                <AdminRemoveButton kind="post" slug={post.slug} label={post.title} />
                <div className="relative aspect-[16/10]">
                  <SiteImage
                    src={post.image}
                    alt=""
                    fill
                    quality={70}
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3 type-meta uppercase tracking-[0.12em] text-vt-muted">
                    <span className="text-vt-red">{post.category}</span>
                    <span aria-hidden>·</span>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                  <h2 className="type-h3 mt-3 text-vt-ink group-hover:text-vt-red">{post.title}</h2>
                  <p className="mt-3 flex-1 text-sm text-vt-muted">{post.excerpt}</p>
                  <span className="mt-4 text-sm font-semibold text-vt-red">Read more →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
