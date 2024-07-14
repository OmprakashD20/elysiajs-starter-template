import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";

import { description, title, version } from "../package.json";

import ErrorPlugin from "@plugins/errors";

const setup = new Elysia()
  .use(cors())
  .use(ErrorPlugin)
  .use(
    swagger({
      documentation: {
        info: {
          title,
          version,
          description,
        },
      },
    })
  );

export default setup;
