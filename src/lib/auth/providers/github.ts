import { GitHub } from "arctic";

import { config } from "@config";
import {
  GithubUserInfo,
  ProviderAuthUrlParams,
  ProviderGetTokensParams,
  User,
} from "@types";

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = config;

const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);

const authUrl = async ({ state }: ProviderAuthUrlParams) =>
  await github.createAuthorizationURL(state, {
    scopes: ["user"],
  });

const getTokens = async ({ code }: ProviderGetTokensParams) =>
  await github.validateAuthorizationCode(code);

const getAccount = async (
  accessToken: string
): Promise<Pick<User, "id" | "email" | "image" | "name">> => {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const user: GithubUserInfo = await response.json();

  if (!response.ok) {
    throw new Error("Failed to sign in with Github");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.avatar_url,
  };
};

export {
  github,
  authUrl as githubAuthUrl,
  getTokens as getGithubTokens,
  getAccount as getGithubAccount,
};
