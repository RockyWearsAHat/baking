interface MixinType {
  name: string;
  value: Mixins;
  price: number;
  allergens?: string[] | readonly string[];
}

export type Mixins =
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

//All the mixin details
export const MIXIN_DETAILS = {
  chocolateChips: {
    value: "chocolateChips",
    name: "Ghirardelli chocolate",
    price: 2,
    allergens: ["dairy"],
  },
  peanutButterChips: {
    value: "peanutButterChips",
    name: "peanut butter chips",
    price: 3,
    allergens: ["dairy", "peanuts"],
  },
  butterfingerPieces: {
    value: "butterfingerPieces",
    name: "Butterfinger pieces",
    price: 0,
    allergens: ["dairy", "peanuts"],
  },
  caramel: {
    value: "caramel",
    name: "caramel pieces",
    price: 0,
    allergens: ["gluten"],
  },
  "m&ms": {
    value: "m&ms",
    name: "M&Ms",
    price: 0,
    allergens: ["dairy"],
  },
  reesesPieces: {
    value: "reesesPieces",
    name: "Reese's Pieces",
    price: 0,
    allergens: ["dairy", "peanuts"],
  },
  whiteChocolateChips: {
    value: "whiteChocolateChips",
    name: "Ghirardelli white chocolate",
    price: 0,
    allergens: ["dairy"],
  },
  coconut: {
    value: "coconut",
    name: "coconut",
    price: 0,
  },
  oats: {
    value: "oats",
    name: "oats",
    price: 0,
  },
  walnuts: {
    value: "walnuts",
    name: "walnuts",
    price: 0,
  },
} as const;

export type MixinKeys = keyof typeof MIXIN_DETAILS;

export const getMixinDetails = (mixin: MixinKeys): MixinType => {
  return MIXIN_DETAILS[mixin];
};

export const getAllMixins = (): Mixins[] => {
  return Object.keys(MIXIN_DETAILS) as Mixins[];
};
