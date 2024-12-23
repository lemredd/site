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
const extractProjects = (projects: Record<string, unknown>[]): Project[] =>
  projects.map((project) =>
    ({
      name: String(project["name"]),
      description: String(project["description"]),
      html_url: String(project["html_url"]),
      topics: project["topics"] as string[],
    }) satisfies Project
  );

export const projectsHandler = (async (_: Request): Promise<Response> => {
  const projects = await fetch("https://api.github.com/users/lemredd/repos")
    .then((response) => {
      console.log(response);
      response.json();
    })
    .then(extractProjects);

  console.log(projects);
  return render({
    name: "work/projects.hx.html",
    context: { projects },
  });
}) satisfies RouteHandler;
