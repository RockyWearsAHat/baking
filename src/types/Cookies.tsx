import { commonProps } from "./Types";

// Simplified flavor definition
export type CookieFlavor = "chocolateChip" | "oatmealRaisin" | "peanutButter";

export interface ICookiesItem extends commonProps {
  type: "cookies";
  flavor: CookieFlavor;
  price: number;
}
