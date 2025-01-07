import { Metadata } from "@/handlers/types.ts";

export const COMMON_META: Metadata["meta"] = [
  {
    nameOrProperty: "name",
    key: "author",
    content: "Jarlem Red de Peralta",
  },
  {
    nameOrProperty: "name",
    key: "keywords",
    content:
      "web development, front-end, back-end, full stack, developer, software engineer",
  },
  {
    nameOrProperty: "name",
    key: "robots",
    content: "index, follow",
  },
  {
    nameOrProperty: "property",
    key: "og:image",
    content: `${Deno.env.get("BASE_URL")}/images/websiteog.png`,
  },
];

export const COMMON_LINKS: Metadata["links"] = [
  {
    rel: "apple-touch-icon",
    href: "/images/apple-touch-icon.png",
  },
  {
    rel: "manifest",
    href: "/manifest.json",
  },
];
