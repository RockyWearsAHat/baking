import { CookieFlavor } from "../types/Cookies";

export const flavors = [
  {
    value: "chocolateChip",
    name: "Chocolate Chip",
    image: "Cookie.jpg",
    price: 40,
  },
  {
    value: "oatmealRaisin",
    name: "Oatmeal Raisin",
    image: "Oatmeal-Rasin.jpg",
    price: 35,
  },
  {
    value: "peanutButter",
    name: "Peanut Butter",
    image: "PB-Cookie.jpg",
    price: 30,
  },
];

export const cookieFlavorAllergens: Record<CookieFlavor, string[]> = {
  chocolateChip: ["gluten", "dairy", "eggs"],
  oatmealRaisin: ["gluten", "dairy", "eggs"],
  peanutButter: ["gluten", "dairy", "peanuts", "eggs"],
};
