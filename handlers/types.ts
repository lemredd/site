export type RouteHandler = (request: Request) => Response | Promise<Response>;

const META_KEYS = [
  "description",
  "author",
  "keywords",
  "robots",
  "og:title",
  "og:description",
  "og:type",
  "twitter:card",
  "twitter:title",
  "twitter:description",
  "og:image",
] as const;
type MetaKey = typeof META_KEYS[number];
interface Meta {
  nameOrProperty: "name" | "property";
  key: MetaKey;
  content: string;
}
const META_REL_KEYS = [
  "apple-touch-icon",
  "manifest",
];
type MetaRelKey = typeof META_REL_KEYS[number];
interface MetaLink {
  rel: MetaRelKey;
  href: string;
}
export interface Metadata {
  meta: Array<Meta>;
  links: Array<MetaLink>;
}
