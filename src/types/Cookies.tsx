import { commonProps } from "./Types";

// Simplified flavor definition
export type CookieFlavor = "chocolateChip" | "oatmealRaisin" | "peanutButter";

// Assign known allergens per flavor
export const cookieFlavorAllergens: Record<CookieFlavor, string[]> = {
  chocolateChip: ["dairy", "gluten", "eggs"],
  oatmealRaisin: ["dairy", "gluten", "eggs"],
  peanutButter: ["dairy", "gluten", "peanuts", "eggs"],
};

export interface ICookiesItem extends commonProps {
  type: "cookies";
  flavor: CookieFlavor;
  price: number;
}
