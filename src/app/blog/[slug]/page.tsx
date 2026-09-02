import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHero, Reveal } from "@/components/ui/section";
import { SiteImage } from "@/components/ui/site-image";
import { getPublishedPost, getPublishedPosts } from "@/lib/cms";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Article" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
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
                <SiteImage src={post.image} alt="" fill className="object-cover" sizes="768px" />
              </div>
              <div className="p-8 sm:p-10">
                {post.bodyHtml ? (
                  <div
                    className="article-body text-vt-slate"
                    dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
                  />
                ) : (
                  <div className="space-y-5 text-vt-slate">
                    {(post.body ?? post.excerpt)
                      .split(/\n{2,}/)
                      .map((paragraph) => (
                        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                      ))}
                  </div>
                )}
                <div className="pt-8">
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
