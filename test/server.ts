const [mode] = Deno.args;

if (!["up", "down"].some((m) => m === mode)) {
  console.error("Can only run with 'up' or 'down' mode");
  Deno.exit(1);
}

if (mode === "up") {
  const command = new Deno.Command("deno", {
    args: ["task", "dev"],
  });

  const process = command.spawn();
  console.log("process pid: ", process.pid);
  Deno.writeTextFileSync("/tmp/server_pid", String(process.pid));
}

if (mode === "down") {
  const pid = parseInt(Deno.readTextFileSync("/tmp/server_pid"));
  Deno.removeSync("/tmp/server_pid");
  Deno.kill(pid);
}
