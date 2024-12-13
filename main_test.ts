/**
 * TODO:
 * 1. Run web server on a separate thread
 */

import { assert } from "@std/assert";
import { mainHandler } from "./main.ts";

Deno.test("404 for unknown routes", async () => {
  const request = new Request("http://localhost:8000/unknown");
  const response = await mainHandler(request);
  assert(response.status === 404);
});
