export interface IMenuProductCard {
  name: string;
  link: string;
  imageName: string;
}

//Mixins common between all items
type mixins =
  | "chocolateChips"
  | "peanutButterChips"
  | "butterfingerPieces"
  | "caramel"
  | "m&ms"
  | "reesesPieces"
  | "whiteChocolateChips"
  | "coconut"
  | "oats"
  | "walnuts";

type frostingFlavors = "vanilla" | "chocolate" | "creamCheese" | "buttercream";

//Common properties for all items
interface commonProps {
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  isNutFree?: boolean;
  isEggFree?: boolean;
  isVegan?: boolean;
  otherAllergens?: string | string[];
  mixins?: mixins | mixins[];
}

type cookieFlavors = "chocolateChip" | "oatmealRaisin" | "peanutButter";

interface ICookiesItem extends commonProps {
  type: "cookies";
  flavor: cookieFlavors;
}

type brownieFlavors = "chocolate";

interface IBrowniesItem extends Omit<commonProps, "mixins"> {
  type: "brownies";
  flavor: brownieFlavors;
  toppings?: mixins | mixins[];
  mixins?: mixins | "fudge" | (mixins | "fudge")[];
}

type muffinFlavors = "lemonBlueberry" | "chocolateChip" | "bananaNut";

interface IMuffinsItem extends commonProps {
  type: "muffins";
  flavor: muffinFlavors;
  toppings?: mixins | mixins[];
}

interface cakeCommonProps extends commonProps {
  cakeFlavor: cakeFlavors | cakeFlavors[];
  frostingFlavor: frostingFlavors;
  mixins?: mixins | mixins[];
}

type cakeFlavors = "vanilla" | "chocolate";

interface ICupcakesItem extends cakeCommonProps {
  type: "cupcakes";
}

type cakeFillings =
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

type IItem =
  | ICookiesItem
  | IBrowniesItem
  | IMuffinsItem
  | ICupcakesItem
  | ICakeItem;

export interface ICartItem {
  item: IItem;
  quantity: number;
}
