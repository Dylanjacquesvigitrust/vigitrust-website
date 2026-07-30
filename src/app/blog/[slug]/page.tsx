import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHero, Reveal } from "@/components/ui/section";
import { blog } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blog.posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blog.posts.find((p) => p.slug === slug);
  if (!post) return { title: "Article" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blog.posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <PageHero eyebrow={post.category} title={post.title} body={post.excerpt}>
        <time className="text-sm text-white/70" dateTime={post.date}>
          {new Date(post.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
      </PageHero>
      <section className="section-pad">
        <div className="container-vt max-w-3xl">
          <Reveal>
            <article className="overflow-hidden rounded-2xl bg-white ring-1 ring-vt-border">
              <div className="relative aspect-[16/9]">
                <Image src={post.image} alt="" fill className="object-cover" sizes="768px" />
              </div>
              <div className="space-y-5 p-8 text-vt-slate sm:p-10">
                <p>{post.excerpt}</p>
                <p>
                  This article reflects themes covered across VigiTrust’s news, Advisory Board
                  conversations, and customer programmes: operationalising GRC, strengthening
                  workforce awareness, and keeping evidence continuous rather than episodic.
                </p>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Button href="/demo">Book A Demo</Button>
                  <Button href="/blog" variant="ghost">
                    Back to blog
                  </Button>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>
    </>
  );
}
