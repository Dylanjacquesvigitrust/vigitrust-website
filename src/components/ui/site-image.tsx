import Image, { type ImageProps } from "next/image";
import { withBasePath } from "@/lib/paths";

type SiteImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

/** next/image wrapper that respects GitHub Pages basePath for public assets. */
export function SiteImage({ src, alt, ...props }: SiteImageProps) {
  return <Image src={withBasePath(src)} alt={alt} {...props} />;
}
