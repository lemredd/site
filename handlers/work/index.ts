// @deno-types="npm:@types/memory-cache"
import cache from "memory-cache";

import { render } from "@/handlers/utils.ts";
import { RouteHandler } from "@/handlers/types.ts";

export const workHandler = ((request: Request): Response => {
  return render({
    name: "work/index.html",
    context: { request, title: "Work" },
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

export const projectsHandler = (async (_: Request): Promise<Response> => {
  // TODO: cache projects using `Deno.kv` once stable
  const cachedProjects = cache.get(PROJECTS_CACHE_KEY);
  if (cachedProjects) {
    return new Response(null, { status: 304 });
  }

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
