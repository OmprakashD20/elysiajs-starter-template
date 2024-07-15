import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import ApiPlugin from "@modules";
import ErrorPlugin from "@plugins/errors";
import SwaggerPlugin from "@plugins/swagger";

const setup = new Elysia()
  .use(cors())
  .use(SwaggerPlugin)
  .use(ErrorPlugin)
  .use(ApiPlugin);

export default setup;
