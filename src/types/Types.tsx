import { ICookiesItem } from "./Cookies";
import { Mixins } from "./Mixins";

export interface IMenuProductCard {
  name: string;
  link: string;
  imageName: string;
}

//Common properties for all items
export interface commonProps {
  mixins?: Mixins | Mixins[];
  selectedAllergies?: string[];
  otherAllergens?: string | string[];
}

export type frostingFlavors =
  | "vanilla"
  | "chocolate"
  | "creamCheese"
  | "buttercream";

export type brownieFlavors = "chocolate";

interface IBrowniesItem extends Omit<commonProps, "Mixins"> {
  type: "brownies";
  flavor: brownieFlavors;
  toppings?: Mixins | Mixins[];
  Mixins?: Mixins | "fudge" | (Mixins | "fudge")[];
}

export type muffinFlavors = "lemonBlueberry" | "chocolateChip" | "bananaNut";

interface IMuffinsItem extends commonProps {
  type: "muffins";
  flavor: muffinFlavors;
  toppings?: Mixins | Mixins[];
}

interface cakeCommonProps extends commonProps {
  cakeFlavor: cakeFlavors | cakeFlavors[];
  frostingFlavor: frostingFlavors;
  Mixins?: Mixins | Mixins[];
}

export type cakeFlavors = "vanilla" | "chocolate";

interface ICupcakesItem extends cakeCommonProps {
  type: "cupcakes";
}

export type cakeFillings =
  | "whippedCream"
  | "creamCheese"
  | "buttercream"
  | "strawberries"
  | "raspberries"
  | "blueberries";

interface ICakeItem extends Omit<cakeCommonProps, "frostingFlavor"> {
  frostingFlavor:
    | frostingFlavors
    | "darkChocolateGanache"
    | "milkChocolateGanache"
    | "whiteChocolateGanache";
  type: "cake";
  layers: number;
  fillings?: cakeFillings | cakeFillings[];
}

export type IItem =
  | ICookiesItem
  | IBrowniesItem
  | IMuffinsItem
  | ICupcakesItem
  | ICakeItem;

export interface ICartItem {
  item: IItem;
  quantity: number;
}
