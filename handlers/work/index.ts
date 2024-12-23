import { render } from "@/handlers/utils.ts";
import { RouteHandler } from "@/handlers/types.ts";

export const workHandler = ((request: Request): Response => {
  return render({
    name: "work/index.html",
    context: { request, title: "Work" },
  });
}) satisfies RouteHandler;

interface Project {
  name: string;
  description: string;
  html_url: string;
  topics: string[];
}

const FEATURED_PROJECT_TOPIC = "portfolio-featured";

const getFeaturedProjects = (project: Record<string, unknown>): boolean =>
  (project["topics"] as string[]).includes(FEATURED_PROJECT_TOPIC);

const extractProjects = (projects: Record<string, unknown>[]): Project[] =>
  projects.filter(getFeaturedProjects).slice(0, 3).map((project) =>
    ({
      name: String(project["name"]),
      description: String(project["description"]),
      html_url: String(project["html_url"]),
      topics: project["topics"] as string[],
    }) satisfies Project
  );

export const projectsHandler = (async (_: Request): Promise<Response> => {
  const projects = await fetch("https://api.github.com/users/lemredd/repos")
    .then((response) => response.json())
    .then(extractProjects);

  return render({
    name: "work/projects.hx.html",
    context: { projects },
  });
}) satisfies RouteHandler;
