import { Elysia } from "elysia";

import { config } from "@config";
import setup from "@setup";

const app = new Elysia()
  .use(setup)
  .get("/", ({ set }) => {
    set.redirect = "/swagger";
  })
  .listen(config.PORT);

console.log(
  `🦊 Elysia is running! Access Swagger UI at http://${app.server?.hostname}:${app.server?.port}/swagger`
);
