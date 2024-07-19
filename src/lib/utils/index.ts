import { Omit } from "@sinclair/typebox";
import { createDate, TimeSpan, type TimeSpanUnit } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";

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
