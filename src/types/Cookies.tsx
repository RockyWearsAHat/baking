import { commonProps } from "./Types";

export type cookieFlavors = "chocolateChip" | "oatmealRaisin" | "peanutButter";

export interface ICookiesItem extends commonProps {
  type: "cookies";
  flavor: cookieFlavors;
}
