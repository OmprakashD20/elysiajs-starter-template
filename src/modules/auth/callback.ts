import Elysia, { InternalServerError, t } from "elysia";
import { GitHubTokens, GoogleTokens, OAuth2RequestError } from "arctic";

import { luciaSession } from "@auth";
import db from "@db";
import {
  createOAuthAccount,
  createUser,
  getOAuthAccountByProvider,
  getUserByEmail,
} from "@/lib/services";
import { AuthenticationError, BadRequestError } from "@plugins/errors";
import { getAuthAccount, getAuthTokens } from "@utils/auth";

const callback = new Elysia().get(
  "/:provider/callback",
  async ({ cookie, params, query, set }) => {
    const { oauth_state, oauth_code_verifier, oauth_next } = cookie;
    const { provider } = params;
    const { code, state } = query;

    const next = oauth_next?.value ?? "/";

    const storedState = oauth_state?.value;
    const storedCodeVerifier = oauth_code_verifier?.value;

    if (
      !storedState ||
      !storedCodeVerifier ||
      !code ||
      !state ||
      state !== storedState
    )
      throw new BadRequestError("There was an while signing in with google 😔");

    try {
      const tokens = await getAuthTokens(provider, {
        code,
        codeVerifier: storedCodeVerifier,
      });

      const account = await getAuthAccount(provider, tokens?.accessToken!);

      const existingUser = await getUserByEmail(account?.email!);
      const existingOAuthAccount = await getOAuthAccountByProvider(
        provider,
        account?.id!
      );
      let userId;

      await db.transaction(async (txn) => {
        if (!existingUser) {
          const result = await createUser(
            {
              name: account?.name!,
              email: account?.email!,
              image: account?.image!,
              emailVerified: true,
            },
            txn
          );

          userId = result.userId;
        }
        if (!existingOAuthAccount) {
          await createOAuthAccount(
            {
              accessToken:
                provider === "google"
                  ? (tokens as GoogleTokens).accessToken
                  : (tokens as GitHubTokens).accessToken,
              expiresAt:
                provider === "google"
                  ? (tokens as GoogleTokens).accessTokenExpiresAt
                  : null,
              provider,
              providerUserId: account?.id!,
              userId: existingUser?.id ?? userId!,
            },
            txn
          );
        }
      });

      const session = await luciaSession.create(existingUser?.id ?? userId!);
      const sessionCookie = luciaSession.createCookie(session.id);

      cookie[sessionCookie.name]?.set({
        value: sessionCookie.value,
        ...sessionCookie.attributes,
      });

      set.redirect = next;
    } catch (error: any) {
      if (error instanceof OAuth2RequestError)
        throw new AuthenticationError(
          `There was an error while signing in with ${provider} 😔`
        );

      throw new InternalServerError();
    }
  },
  {
    params: t.Object({
      provider: t.Union([t.Literal("google"), t.Literal("github")], {
        error: "Supported providers are google and github",
      }),
    }),
    query: t.Object(
      {
        code: t.String({
          error: "Invalid query params",
        }),
        state: t.String({
          error: "Invalid query params",
        }),
      },
      {  additionalProperties: true }
    ),
  }
);

export default callback;
