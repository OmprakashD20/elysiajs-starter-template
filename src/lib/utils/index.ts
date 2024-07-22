import { Omit } from "@sinclair/typebox";
import { generateId } from "lucia";
import { createDate, TimeSpan, type TimeSpanUnit } from "oslo";
import { alphabet, generateRandomString, sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";

export type MakeOptional<
  T,
  OptionalKeys extends keyof T,
  OmitKeys extends keyof T = never
> = Partial<Pick<T, OptionalKeys>> & Omit<T, OptionalKeys | OmitKeys>;

export const DEFAULT = Symbol();

export class MapWithDefault<K, V> extends Map<K | typeof DEFAULT, V> {
  get(key: K): V {
    return super.get(key) ?? (super.get(DEFAULT) as V);
  }
}

export function generatePasswordSalt(): string {
  return generateRandomString(32, alphabet("0-9", "A-Z", "a-z"));
}

export function generateVerificationCode(
  time: number = 15,
  timeSpanUnit: TimeSpanUnit = "m"
): { expirationDate: Date; verificationCode: string } {
  const expirationDate = createDate(new TimeSpan(time, timeSpanUnit));
  const verificationCode = generateRandomString(6, alphabet("0-9", "A-Z"));

  return { expirationDate, verificationCode };
}

export async function encode(data: string): Promise<string> {
  return encodeHex(await sha256(new TextEncoder().encode(data)))
}

export async function generateResetToken(
  time: number = 2,
  timeSpanUnit: TimeSpanUnit = "h"
): Promise<{
  expirationDate: Date;
  resetToken: string;
  hashedResetToken: string;
}> {
  const token = generateId(40);
  const hashedToken = await encode(token);

  const expirationDate = createDate(new TimeSpan(time, timeSpanUnit));

  return { expirationDate, resetToken: token, hashedResetToken: hashedToken };
}
