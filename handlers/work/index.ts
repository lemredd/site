// @deno-types="npm:@types/memory-cache"
import cache from "memory-cache";

import { RouteHandler } from "@/handlers/types.ts";
import { getBoostDirection, render } from "@/handlers/utils.ts";

export const workHandler = ((request: Request): Response => {
  const SKILLS = [
    "Golang",
    "Python",
    "SQL",
    "JSON",
    "Protobuf",
    "JavaScript",
    "TypeScript",
    "CSS",
    "HTML",
    "Shell",
    "Lua",
    "REST API",
    "GraphQL",
    "Deno",
    "Cloudflare",
    "Vercel",
    "GitHub",
    "GitLab",
    "PWA",
    "Docker",
    "Linux",
    "Figma",
  ];
  return render({
    name: "work/index.html",
    context: {
      request,
      title: "Work",
      skills: SKILLS,
      boostDirection: getBoostDirection(request),
    },
  });
}) satisfies RouteHandler;

export interface Project {
  name: string;
  description: string;
  html_url: string;
  topics: string[];
}

const FEATURED_PROJECT_TOPIC = "portfolio-featured";
const PROJECTS_CACHE_KEY = "projects";
const CACHE_EXPIRATION = 1000 * 60 * 60;

const getFeaturedProjects = (project: Record<string, unknown>): boolean =>
  (project["topics"] as string[]).includes(FEATURED_PROJECT_TOPIC);

const extractProjects = (projects: Record<string, unknown>[]): Project[] => {
  const filtered = projects.filter(getFeaturedProjects).slice(0, 3).map((
    project,
  ) =>
    ({
      name: String(project["full_name"]),
      description: String(project["description"]),
      html_url: String(project["html_url"]),
      topics: project["topics"] as string[],
    }) satisfies Project
  );

  cache.put(PROJECTS_CACHE_KEY, filtered, CACHE_EXPIRATION);
  return filtered;
};
const fallBackProjects = (): Project[] => [
  {
    name: "Portfolio",
    description: "This portfolio site",
    html_url: "https://github.com/lemredd/lemredd.github.io",
    topics: ["portfolio-featured"],
  },
];

const checkHXHeaders = (request: Request): boolean =>
  request.headers.get("HX-Request") === "true" &&
  new URL(request.headers.get("HX-Current-URL") ?? "").pathname.endsWith(
    "/work",
  );

const returnByCache = (
  request: Request,
  cachedProjects: Project[],
): Response => {
  if (request.headers.get("Cache-Control") === "no-cache") {
    return render({
      name: "work/projects.hx.html",
      context: { projects: cachedProjects },
    });
  }

  return new Response(null, { status: 304 });
};

export const projectsHandler = (async (request: Request): Promise<Response> => {
  if (!checkHXHeaders(request)) {
    return new Response("You cannot access this page.", { status: 403 });
  }

  const cachedProjects = cache.get(PROJECTS_CACHE_KEY);
  if (cachedProjects) return returnByCache(request, cachedProjects);

  const projects = await fetch(
    "https://api.github.com/users/lemredd/repos?sort=created&direction=desc",
  )
    .then((response) => {
      if (!response.ok) throw response;
      return response.json();
    })
    .then(extractProjects)
    .catch(fallBackProjects);

  return render({
    name: "work/projects.hx.html",
    context: { projects },
  });
}) satisfies RouteHandler;
