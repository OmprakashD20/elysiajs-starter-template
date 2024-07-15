import Elysia from "elysia";

import { DEFAULT, MapWithDefault } from "@utils";

export class AuthenticationError extends Error {
  public status = 401;
  public type = "Authentication";
  constructor(message: string) {
    super(message);
  }
}

export class AuthorizationError extends Error {
  public status = 403;
  public type = "Authorization";
  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends Error {
  public status = 400;
  public type = "Bad Request";
  constructor(message: string) {
    super(message);
  }
}

export class ClientError extends Error {
  public status: number;
  public type: string;
  constructor(message: string, status: number, type: string) {
    super(message);
    this.status = status;
    this.type = type;
  }
}

export const ERROR_CODE_STATUS = new MapWithDefault<string, number>([
  ["PARSE", 400],
  ["BAD_REQUEST", 400],
  ["INVALID_COOKIE_SIGNATURE", 401],
  ["AUTHENTICATION", 401],
  ["AUTHORIZATION", 403],
  ["NOT_FOUND", 404],
  ["VALIDATION", 422],
  ["INTERNAL_SERVER_ERROR", 500],
  ["UNKNOWN", 500],
  [DEFAULT, 500],
]);

const ErrorPlugin = new Elysia()
  .error({
    AUTHENTICATION: AuthenticationError,
    AUTHORIZATION: AuthorizationError,
    CLIENT_ERROR: ClientError,
  })
  .onError({ as: "global" }, ({ code, error, set }) => {
    set.status = ERROR_CODE_STATUS.get(code);

    const errorType = "type" in error ? error.type : "Internal";

    return {
      error: {
        [errorType]: error.message,
      },
    };
  });

export default ErrorPlugin;
