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
    content: "/images/websiteog.png",
  },
  {
    nameOrProperty: "name",
    key: "description",
    content:
      "I craft elegant, scalable solutions to complex challenges, combining my expertise in front-end design and back-end development to build seamless, user-focused web applications.",
  },
  {
    nameOrProperty: "property",
    key: "og:description",
    content:
      "I craft elegant, scalable solutions to complex challenges, combining my expertise in front-end design and back-end development to build seamless, user-focused web applications.",
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

export const TURNSTILE_WIDGET_ID = "contact-form-turnstile";
export const MARQUEE_OBSERVER_ID = "marquee-observer";
export const MARQUEE_ID = "marquee";
export const MARQUEE_DUP_ID_PREFIX = "dup-";
