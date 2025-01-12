import { COMMON_LINKS as links, COMMON_META } from "@/handlers/constants.ts";
import { Metadata, RouteHandler } from "@/handlers/types.ts";
import { getBoostDirection, render } from "@/handlers/utils.ts";

const meta: Metadata["meta"] = [
  {
    nameOrProperty: "property",
    key: "og:title",
    content: "About | Lemredd",
  },
  ...COMMON_META,
];

const metadata = {
  meta,
  links,
} satisfies Metadata;
export const aboutHandler = ((request: Request): Response => {
  return render({
    name: "about/index.html",
    context: {
      request,
      metadata,
      title: "About",
      boostDirection: getBoostDirection(request),
    },
  });
}) satisfies RouteHandler;
