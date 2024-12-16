import { mainHandler } from "@/handlers/index.ts";

Deno.serve({ port: Number(Deno.env.get("PORT") ?? 8000) }, mainHandler);
