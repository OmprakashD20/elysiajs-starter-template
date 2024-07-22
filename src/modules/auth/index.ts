import Elysia from "elysia";

import provider from "@modules/auth/provider";
import callback from "@modules/auth/callback";
import register from "@modules/auth/register";
import verify from "@modules/auth/verify";
import login from "@modules/auth/login";
import logout from "@modules/auth/logout";
import resetPassword from "@modules/auth/reset-password";

const AuthModule = new Elysia({
  prefix: "/auth",
  detail: {
    tags: ["Auth"],
  },
})
  .use(provider)
  .use(callback)
  .use(register)
  .use(verify)
  .use(login)
  .use(logout)
  .use(resetPassword);

export default AuthModule;
