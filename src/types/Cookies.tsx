import { commonProps } from "./Types";

export type cookieFlavors = "chocolateChip" | "oatmealRaisin" | "peanutButter";

export interface ICookiesItem extends commonProps {
  type: "cookies";
  flavor: cookieFlavors;
  price: number;
}

export type ICookieFlavorAllergens = {
  [key in cookieFlavors]: string[];
};

export const cookieFlavorAllergens: ICookieFlavorAllergens = {
  chocolateChip: ["dairy", "gluten", "eggs"],
  oatmealRaisin: ["dairy", "gluten", "eggs"],
  peanutButter: ["dairy", "gluten", "peanuts", "eggs"],
};
