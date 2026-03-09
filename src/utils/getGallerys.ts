/// <reference types="astro/client" />

import type { ImageMetadata } from "astro";
import type { CollectionEntry } from "astro:content";

type GalleryImageModule = Record<string, { default: ImageMetadata }>;

export type SortedGallery = {
  gallery: CollectionEntry<"galleries">;
  slug: string;
  fallbackImage?: ImageMetadata;
  thumbnails: ImageMetadata[];
  imageCount: number;
};

const allImages: GalleryImageModule = import.meta.glob<{
  default: ImageMetadata;
}>("/src/data/galleries/**/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}", {
  eager: true,
});

export function getGallerySlug(id: string): string {
  return id.replace(/\/index\.(md|mdx)$/, "").replace(/\.(md|mdx)$/, "");
}

export function getGalleryImages(slug: string): ImageMetadata[] {
  return Object.entries(allImages)
    .filter(
      ([path]) =>
        path.startsWith(`/src/data/galleries/${slug}/`) &&
        !path.endsWith("index.md") &&
        !path.endsWith("index.mdx")
    )
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, mod]) => mod.default);
}

export function getSortedGalleries(
  rawGalleries: CollectionEntry<"galleries">[]
): SortedGallery[] {
  return [...rawGalleries]
    .sort(
      (a, b) =>
        new Date(b.data.pubDatetime).getTime() -
        new Date(a.data.pubDatetime).getTime()
    )
    .map(gallery => {
      const slug = getGallerySlug(gallery.id);
      const folderImages = getGalleryImages(slug);

      return {
        gallery,
        slug,
        fallbackImage: gallery.data.coverImage ?? folderImages[0],
        thumbnails: folderImages.slice(0, 3),
        imageCount: folderImages.length,
      };
    });
}
