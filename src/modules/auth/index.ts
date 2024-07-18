import Elysia from "elysia";

import provider from "@modules/auth/provider";
import callback from "@modules/auth/callback";
import register from "@modules/auth/register";
import login from "@modules/auth/login";
import logout from "@modules/auth/logout";

const AuthModule = new Elysia({
  prefix: "/auth",
  detail: {
    tags: ["Auth"],
  },
})
  .use(provider)
  .use(callback)
  .use(register)
  .use(login)
  .use(logout);

export default AuthModule;
