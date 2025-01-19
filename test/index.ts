const port = Number(Deno.env.get("PORT") || 8000);
try {
  while (true) {
    const listener = await Deno.listen({ port });
    console.log("waiting for server...");
    listener.close();
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
} catch {
  (new Deno.Command("deno", { args: ["test", "-A"] })).spawn();
}
