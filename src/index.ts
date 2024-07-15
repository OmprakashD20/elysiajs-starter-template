import { Elysia } from "elysia";

import { config } from "@config";
import setup from "@setup";

const app = new Elysia()
  .use(setup)
  .get("/", () => {
    return {
      message: "Welcome to Elysia Starter Template!",
    };
  })
  .listen(config.PORT);

console.log(
  `🦊 Elysia is running! Access Swagger UI at http://${app.server?.hostname}:${app.server?.port}/swagger`
);
