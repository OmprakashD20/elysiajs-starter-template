import {
  getGithubAccount,
  getGithubTokens,
  githubAuthUrl,
} from "@/lib/auth/providers/github";
import {
  getGoogleAccount,
  getGoogleTokens,
  googleAuthUrl,
} from "@/lib/auth/providers/google";
import { BadRequestError } from "@plugins/errors";
import {
  AuthProviders,
  ProviderAuthUrlParams,
  ProviderGetTokensParams,
} from "@types";

export const genAuthUrl = async (
  provider: AuthProviders,
  params: ProviderAuthUrlParams
) => {
  switch (provider) {
    case "github":
      return await githubAuthUrl({ ...params });

    case "google":
      return await googleAuthUrl({ ...params });

    default:
      throw new BadRequestError("Provider not supported 😔");
  }
};

export const getAuthTokens = async (
  provider: AuthProviders,
  params: ProviderGetTokensParams
) => {
  switch (provider) {
    case "github":
      return await getGithubTokens({ ...params });

    case "google":
      return await getGoogleTokens({ ...params });

    default:
      throw new BadRequestError("Provider not supported 😔");
  }
};

export const getAuthAccount = async (
  provider: AuthProviders,
  accessToken: string
) => {
  switch (provider) {
    case "github":
      return await getGithubAccount(accessToken);

    case "google":
      return await getGoogleAccount(accessToken);

    default:
      throw new BadRequestError("Provider not supported 😔");
  }
};
