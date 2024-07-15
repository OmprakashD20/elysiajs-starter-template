import Elysia from "elysia";

import AuthModule from "@modules/auth";

const ApiPlugin = new Elysia({
  prefix: "/api",
}).use(AuthModule);

export default ApiPlugin;
