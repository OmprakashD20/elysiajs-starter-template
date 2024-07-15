import { Google } from "arctic";

import { config } from "@config";
import {
  GoogleUserInfo,
  ProviderAuthUrlParams,
  ProviderGetTokensParams,
  User,
} from "@types";

const { BASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = config;

const google = new Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  `${BASE_URL}/api/auth/google/callback`
);

const authUrl = async ({ state, codeVerifier }: ProviderAuthUrlParams) =>
  await google.createAuthorizationURL(state, codeVerifier!, {
    scopes: ["email", "profile"],
  });

const getTokens = async ({ code, codeVerifier }: ProviderGetTokensParams) =>
  await google.validateAuthorizationCode(code, codeVerifier!);

const getAccount = async (
  accessToken: string
): Promise<Pick<User, "id" | "email" | "image" | "name">> => {
  const response = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const user: GoogleUserInfo = await response.json();

  if (!response.ok) {
    throw new Error("Failed to sign in with Google");
  }

  return {
    id: user.sub,
    email: user.email,
    name: user.name,
    image: user.picture,
  };
};

export {
  google,
  authUrl as googleAuthUrl,
  getTokens as getGoogleTokens,
  getAccount as getGoogleAccount,
};
