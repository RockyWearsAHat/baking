import { FC, useState } from "react";
import { cookieFlavors } from "../types/Cookies";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ICartItem } from "../types/Types";
import styles from "../styles/CookieOrderPage.module.css";

import { getAllMixins, getMixinDetails, Mixins } from "../types/Mixins";

export const CookieOrderPage: FC = () => {
  const [cookieSelection, setCookieSelection] = useState({
    flavor: "chocolateChip",
    isGlutenFree: false,
    isDairyFree: false,
    isNutFree: false,
    isEggFree: false,
    isVegan: false,
    otherAllergens: "",
    mixins: [] as Mixins[],
  });

  const { setValue: setCart } = useLocalStorage<ICartItem[]>("cart", []);

  const toggleBoolean = (prop: keyof typeof cookieSelection) => {
    setCookieSelection((prev) => ({ ...prev, [prop]: !prev[prop] }));
  };

  const toggleMixin = (m: Mixins) => {
    setCookieSelection((prev) => {
      const hasMixin = prev.mixins.includes(m);
      return {
        ...prev,
        mixins: hasMixin
          ? prev.mixins.filter((x) => x !== m)
          : [...prev.mixins, m],
      };
    });
  };

  const handleAddToCart = () => {
    console.log(cookieSelection.mixins);
    cookieSelection.mixins.map((mixin) => console.log(getMixinDetails(mixin)));

    const newItem: ICartItem = {
      item: {
        type: "cookies",
        flavor: cookieSelection.flavor as cookieFlavors,
        isGlutenFree: cookieSelection.isGlutenFree,
        isDairyFree: cookieSelection.isDairyFree,
        isNutFree: cookieSelection.isNutFree,
        isEggFree: cookieSelection.isEggFree,
        isVegan: cookieSelection.isVegan,
        otherAllergens: cookieSelection.otherAllergens,
        mixins: cookieSelection.mixins,
      },
      quantity: 1,
    };
    setCart((prev) => [...prev, newItem]);
  };

  const allMixinsDetails = getAllMixins().map((m) => getMixinDetails(m));

  return (
    <div className={styles.cookieOrderWrapper}>
      <h1>Select a Cookie Flavor</h1>
      <label>
        <input
          name="cookieFlavor"
          type="radio"
          value="chocolateChip"
          checked={cookieSelection.flavor === "chocolateChip"}
          onChange={() =>
            setCookieSelection((prev) => ({ ...prev, flavor: "chocolateChip" }))
          }
        />
        Chocolate Chip
      </label>
      <label>
        <input
          name="cookieFlavor"
          type="radio"
          value="oatmealRaisin"
          checked={cookieSelection.flavor === "oatmealRaisin"}
          onChange={() =>
            setCookieSelection((prev) => ({ ...prev, flavor: "oatmealRaisin" }))
          }
        />
        Oatmeal Raisin
      </label>
      <label>
        <input
          name="cookieFlavor"
          type="radio"
          value="peanutButter"
          checked={cookieSelection.flavor === "peanutButter"}
          onChange={() =>
            setCookieSelection((prev) => ({ ...prev, flavor: "peanutButter" }))
          }
        />
        Peanut Butter
      </label>
      <div>
        <label>
          <input
            type="checkbox"
            checked={cookieSelection.isGlutenFree}
            onChange={() => toggleBoolean("isGlutenFree")}
          />
          Gluten Free
        </label>
        <label>
          <input
            type="checkbox"
            checked={cookieSelection.isDairyFree}
            onChange={() => toggleBoolean("isDairyFree")}
          />
          Dairy Free
        </label>
        <label>
          <input
            type="checkbox"
            checked={cookieSelection.isNutFree}
            onChange={() => toggleBoolean("isNutFree")}
          />
          Nut Free
        </label>
        <label>
          <input
            type="checkbox"
            checked={cookieSelection.isEggFree}
            onChange={() => toggleBoolean("isEggFree")}
          />
          Egg Free
        </label>
        <label>
          <input
            type="checkbox"
            checked={cookieSelection.isVegan}
            onChange={() => toggleBoolean("isVegan")}
          />
          Vegan
        </label>
        <input
          type="text"
          placeholder="Other Allergens"
          value={cookieSelection.otherAllergens}
          onChange={(e) =>
            setCookieSelection((prev) => ({
              ...prev,
              otherAllergens: e.target.value,
            }))
          }
        />
        {allMixinsDetails.map((m, i) => (
          <label key={i}>
            <input
              type="checkbox"
              checked={cookieSelection.mixins.includes(m.value)}
              onChange={() => toggleMixin(m.value)}
            />
            {m.name} - {m.price}
          </label>
        ))}
      </div>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};
