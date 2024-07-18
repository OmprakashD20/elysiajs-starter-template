import { alphabet, generateRandomString } from "oslo/crypto";

export const DEFAULT = Symbol();

export class MapWithDefault<K, V> extends Map<K | typeof DEFAULT, V> {
  get(key: K): V {
    return super.get(key) ?? (super.get(DEFAULT) as V);
  }
}

export function generatePasswordSalt(): string {
  return generateRandomString(32, alphabet("0-9", "A-Z", "a-z"));
}
