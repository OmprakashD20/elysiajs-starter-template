import Elysia, { t } from "elysia";
import { generateCodeVerifier, generateState } from "arctic";

import { config } from "@config";
import { genAuthUrl } from "@/lib/utils/auth";

const provider = new Elysia().get(
  "/:provider",
  async ({ cookie, params, set, query }) => {
    const { oauth_state, oauth_code_verifier, oauth_next } = cookie;
    const { provider } = params;
    const { next } = query;

    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    const redirectUrl = await genAuthUrl(provider, {
      state,
      codeVerifier,
    });

    oauth_state?.set({
      value: state,
      path: "/",
      secure: config.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10, //valid for 10 minutes
      sameSite: "lax",
    });

    oauth_code_verifier?.set({
      value: codeVerifier,
      path: "/",
      secure: config.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10, //valid for 10 minutes
      sameSite: "lax",
    });

    oauth_next?.set({
      value: next ?? "/",
      path: "/",
      secure: config.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10, //valid for 10 minutes
      sameSite: "lax",
    });

    set.redirect = redirectUrl?.toString();
  },
  {
    params: t.Object({
      provider: t.Union([t.Literal("google"), t.Literal("github")]),
    }),
    query: t.Object({
      next: t.Optional(t.String()),
    }),
  }
);

export default provider;
