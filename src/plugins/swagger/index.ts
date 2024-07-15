import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";

import { description, title, version } from "@package.json";

const SwaggerPlugin = () =>
  new Elysia().use(
    swagger({
      documentation: {
        info: {
          title,
          version,
          description,
        },
        tags: [
          {
            name: "Auth",
            description: "Authentication related endpoints",
          },
        ],
      },
      // exclude: ["/api/auth/{provider}", "/api/auth/{provider}/callback"],
    })
  );

export default SwaggerPlugin;
