import Elysia from "elysia";

import { AuthMiddleware } from "@/middlewares";
import AuthModule from "@modules/auth";

const ApiPlugin = new Elysia({
  prefix: "/api",
})
  .use(AuthMiddleware)
  .use(AuthModule);

export default ApiPlugin;
