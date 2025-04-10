import { FC, useEffect, useState } from "react";
import { cookieFlavors } from "../types/Cookies";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ICartItem } from "../types/Types";
import styles from "../styles/CookieOrderPage.module.css";
import { getAllMixins, getMixinDetails, Mixins } from "../types/Mixins";
import { CiWheat } from "react-icons/ci";
import { LuEgg, LuMilk } from "react-icons/lu";
import { GiPeanut } from "react-icons/gi";
import React from "react";
import { IoIosArrowDown } from "react-icons/io";

export const convertNameToTitleCase = (name: string) => {
  return name.replace(/(^\w)|([-\s]\w)/g, (m) => m.toUpperCase());
};

// Define the allergy options with icons and conflict keys
const allergyOptions = [
  {
    value: "gluten",
    label: "Gluten Free",
    icon: <CiWheat />,
    conflict: "gluten",
  },
  {
    value: "dairy",
    label: "Dairy Free",
    icon: <LuMilk />,
    conflict: "dairy",
  },
  {
    value: "peanuts",
    label: "Nut Free",
    icon: <GiPeanut />,
    conflict: "peanuts",
  },
  {
    value: "eggs",
    label: "Egg Free",
    icon: <LuEgg />,
    conflict: "eggs",
  },
];

interface AllergySectionProps {
  selectedAllergies: string[];
  setSelectedAllergies: (allergies: string[]) => void;
  cookieSelection: any;
  setCookieSelection: any;
  mixins: any[];
}

export const AllergySection: React.FC<AllergySectionProps> = ({
  selectedAllergies,
  setSelectedAllergies,
  cookieSelection,
  setCookieSelection,
  mixins,
}) => {
  const handleOptionClick = (option: (typeof allergyOptions)[number]) => {
    // Prevent toggling if the option is disabled because of a conflict
    if (isOptionDisabled(option)) return;
    if (selectedAllergies.includes(option.value)) {
      setSelectedAllergies(selectedAllergies.filter((a) => a !== option.value));
    } else {
      setSelectedAllergies([...selectedAllergies, option.value]);
    }
  };

  const isOptionDisabled = (option: (typeof allergyOptions)[number]) => {
    // Disable if any selected mixin's details include the conflicting allergen.
    for (const mixin of mixins) {
      const details = getMixinDetails(mixin);
      if (details.allergens && details.allergens.includes(option.conflict)) {
        return true;
      }
    }
    return false;
  };

  let dairy: any[] = [];
  let gluten: any[] = [];
  let nuts: any[] = [];
  let eggs: any[] = [];

  const [allergensContained, setAllergensContained] = useState<string>("");

  useEffect(() => {
    const allergensContained = [
      ...new Set(
        cookieSelection.mixins.reduce((acc: string[], mixin: Mixins) => {
          const details = getMixinDetails(mixin);
          if (details.allergens) {
            acc.push(...details.allergens);

            console.log(details.allergens);
            if (details.allergens.includes("dairy")) {
              dairy.push(mixin);
            }
            if (details.allergens.includes("eggs")) {
              eggs.push(mixin);
            }
            if (details.allergens.includes("gluten")) {
              gluten.push(mixin);
            }
            if (details.allergens.includes("peanuts")) {
              nuts.push(mixin);
            }
          }
          return acc;
        }, [])
      ),
    ];

    setSelectedAllergies(
      selectedAllergies.filter((a) => !allergensContained.includes(a))
    );

    const allergensMap: Record<string, string[]> = {
      dairy: dairy.map((mixin) => getMixinDetails(mixin).name),
      gluten: gluten.map((mixin) => getMixinDetails(mixin).name),
      peanuts: nuts.map((mixin) => getMixinDetails(mixin).name),
      eggs: eggs.map((mixin) => getMixinDetails(mixin).name),
    };

    // Build a map of mixin -> set of allergens
    const mixinAllergens: Record<string, Set<string>> = {};
    Object.entries(allergensMap).forEach(([allergen, theseMixins]) => {
      theseMixins.forEach((mixin) => {
        if (!mixinAllergens[mixin]) mixinAllergens[mixin] = new Set();
        mixinAllergens[mixin].add(allergen);
      });
    });

    // Group by identical sets of allergens
    const groupedMap: Record<string, string[]> = {};
    Object.entries(mixinAllergens).forEach(([mixinName, allergenSet]) => {
      const sortedAllergens = Array.from(allergenSet).sort();
      const key = sortedAllergens.join(",");
      if (!groupedMap[key]) groupedMap[key] = [];
      groupedMap[key].push(mixinName);
    });

    // Return a description grouped by allergens
    const groupedDescriptions = Object.entries(groupedMap).map(
      ([key, mixinNames]) => {
        const allergenList = key.split(",");
        const allergenText =
          allergenList.length > 1
            ? allergenList.slice(0, -1).join(", ") +
              " and " +
              allergenList.slice(-1)
            : allergenList[0];
        const mixinText =
          mixinNames.length > 1
            ? mixinNames.slice(0, -1).join(", ") +
              " and " +
              mixinNames.slice(-1)
            : mixinNames[0];
        return `${mixinText} contain ${allergenText}`;
      }
    );

    setAllergensContained(groupedDescriptions.join(", and "));

    console.log(dairy, gluten, nuts, eggs);
  }, [cookieSelection.mixins]);

  return (
    <div className={styles.allergySectionWrapper}>
      <h1 className={styles.allergyTitle}>Allergies & Special Instructions</h1>
      <div className={styles.allergyCardsWrapper}>
        {allergyOptions.map((option) => (
          <div
            key={option.value}
            className={`
              ${styles.allergyCard} 
              ${
                selectedAllergies.includes(option.value)
                  ? styles.selectedAllergy
                  : ""
              } 
              ${isOptionDisabled(option) ? styles.disabledAllergy : ""}
            `}
            onClick={() => handleOptionClick(option)}
          >
            {option.icon}
            <span style={{ paddingLeft: "5px" }}>{option.label}</span>
          </div>
        ))}
      </div>
      {allergensContained && (
        <p className={styles.allergenWarning}>
          <span style={{ textDecoration: "underline", fontWeight: "bold" }}>
            ALLERGEN WARNING
          </span>
          :{" "}
          {allergensContained.substring(0, 1).toUpperCase() +
            allergensContained.substring(1)}
        </p>
      )}
      <input
        type="text"
        placeholder="Other Allergens"
        value={cookieSelection.otherAllergens}
        onChange={(e) =>
          setCookieSelection((prev: any) => ({
            ...prev,
            otherAllergens: e.target.value,
          }))
        }
        className={styles.allergyInput}
      />
    </div>
  );
};

export const CookieOrderPage: FC = () => {
  // Reset scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Note: We’ve replaced the individual allergen booleans with a single selectedAllergies array.
  const [cookieSelection, setCookieSelection] = useState({
    flavor: "chocolateChip",
    selectedAllergies: [] as string[],
    otherAllergens: "",
    mixins: [] as Mixins[],
  });

  const { setValue: setCart } = useLocalStorage<ICartItem[]>("cart", []);

  // Toggle mixins as before.
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

  // When adding to cart, include the selected allergies.
  const handleAddToCart = () => {
    cookieSelection.mixins.map((mixin) => console.log(getMixinDetails(mixin)));

    const newItem: ICartItem = {
      item: {
        type: "cookies",
        flavor: cookieSelection.flavor as cookieFlavors,
        // selectedAllergies: cookieSelection.selectedAllergies,
        otherAllergens: cookieSelection.otherAllergens,
        mixins: cookieSelection.mixins,
      },
      quantity: 1,
    };
    setCart((prev) => [...prev, newItem]);
  };

  const allMixinsDetails = getAllMixins().map((m) => getMixinDetails(m));

  const flavorOptions = [
    { value: "chocolateChip", name: "Chocolate Chip", image: "Cookie.jpg" },
    {
      value: "oatmealRaisin",
      name: "Oatmeal Raisin",
      image: "Oatmeal-Rasin.jpg",
    },
    { value: "peanutButter", name: "Peanut Butter", image: "PB-Cookie.jpg" },
  ];

  // Simple scroll utility.
  const scrollToSection = (id: string, delay: number = 0) => {
    setTimeout(() => {
      window.scrollTo({
        top: document.getElementById(id)?.offsetTop! - 62,
        behavior: "smooth",
      });
    }, delay);
  };

  return (
    <>
      <div className={styles.orderPageFlavorWrapper}>
        <h1 className={styles.flavorTitle}>Base Flavor</h1>
        <div className={styles.flavorCardsWrapper}>
          {flavorOptions.map((flavor) => (
            <div
              key={flavor.value}
              className={`${styles.flavorCard} ${
                cookieSelection.flavor === flavor.value
                  ? styles.selectedFlavorCard
                  : ""
              }`}
              onClick={() => {
                setCookieSelection((prev) => ({
                  ...prev,
                  flavor: flavor.value,
                }));
                scrollToSection("mixinSection");
              }}
            >
              <img src={`/${flavor.image}`} alt={flavor.name} />
              <p>{flavor.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.mixinSection} id="mixinSection">
        <div className={styles.mixinTitle}>
          <h1>
            Add your mixins<sup>*</sup>
          </h1>
          <p className={styles.mixinSubtext}>Additional charges may apply.</p>
        </div>
        <div className={styles.mixinWrapper}>
          {allMixinsDetails.map((m, i) => (
            <div key={i} className={styles.mixinCard}>
              <label
                className={styles.mixinLabel}
                style={{ backgroundImage: `url(/${m.value}.jpg)` }}
              >
                <input
                  type="checkbox"
                  checked={cookieSelection.mixins.includes(m.value)}
                  onChange={() => {
                    toggleMixin(m.value);
                    console.log(m.value);
                  }}
                  style={{ display: "none" }}
                />
              </label>
              <div className={styles.mixinDetails}>
                {convertNameToTitleCase(m.name)}
              </div>
              <div className={styles.mixinPrice}>
                <p>{m.price > 0 ? `$${m.price}` : "Free"}</p>
              </div>
            </div>
          ))}
        </div>
        <div
          onClick={() => scrollToSection("allergySection")}
          className={styles.nextSectionButton}
        >
          <IoIosArrowDown />
          <IoIosArrowDown />
          <IoIosArrowDown />
        </div>
      </div>
      <div id="allergySection" className={styles.allergySection}>
        {/* Render the allergen options inline */}
        <AllergySection
          selectedAllergies={cookieSelection.selectedAllergies}
          setSelectedAllergies={(allergies) =>
            setCookieSelection((prev) => ({
              ...prev,
              selectedAllergies: allergies,
            }))
          }
          setCookieSelection={setCookieSelection}
          cookieSelection={cookieSelection}
          mixins={cookieSelection.mixins}
        />
        {/* Styled "Other Allergens" textbox */}
      </div>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </>
  );
};
