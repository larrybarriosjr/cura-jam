import { v4 } from "uuid";

export type UUIDv4 = `${string}-${string}-${string}-${string}-${string}`;
export const uuid = () => v4() as UUIDv4;

export const trimWhiteSpaceOnly = (text: string) => {
  return text.replace(/[^\S\n]+/g, " ");
};
