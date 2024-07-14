import { InferResultType } from "./db";

export enum NODE_ENV {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test",
}

export type User = InferResultType<"UserTable">;

export type GoogleUserInfo = {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
  updated_at: number;
};

export type ProviderAuthUrlParams = {
  state: string;
  codeVerifier: string;
};

export type ProviderGetTokensParams = {
  code: string;
  codeVerifier: string;
};
