import { FC, useEffect, useState } from "react";
import { cookieFlavors, cookieFlavorAllergens } from "../types/Cookies";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ICartItem } from "../types/Types";
import styles from "../styles/CookieOrderPage.module.css";
import { getAllMixins, getMixinDetails, Mixins } from "../types/Mixins";

import { CiWheat } from "react-icons/ci";
import { LuEgg, LuMilk } from "react-icons/lu";
import { GiPeanut } from "react-icons/gi";
import { IoIosArrowDown } from "react-icons/io";

export const convertNameToTitleCase = (name: string) => {
  return name.replace(/(^\w)|([-\s]\w)/g, (m) => m.toUpperCase());
};

const allergyOptions = [
  {
    value: "gluten",
    label: "Gluten Free",
    icon: <CiWheat />,
    allergen: "gluten",
  },
  {
    value: "dairy",
    label: "Dairy Free",
    icon: <LuMilk />,
    allergen: "dairy",
  },
  {
    value: "peanuts",
    label: "Nut Free",
    icon: <GiPeanut />,
    allergen: "peanuts",
  },
  {
    value: "eggs",
    label: "Egg Free",
    icon: <LuEgg />,
    allergen: "eggs",
  },
];

interface AllergySectionProps {
  selectedAllergies: string[];
  setSelectedAllergies: (allergies: string[]) => void;
  cookieSelection: any;
  setCookieSelection: any;
  mixins: any[];
  setAllergensContained: (allergens: string) => void;
  allergensContained: string;
}

export const AllergySection: React.FC<AllergySectionProps> = ({
  selectedAllergies,
  setSelectedAllergies,
  cookieSelection,
  setCookieSelection,
  mixins,
  setAllergensContained,
  allergensContained,
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
      if (details.allergens && details.allergens.includes(option.allergen)) {
        return true;
      }
    }
    return false;
  };

  let dairy: any[] = [];
  let gluten: any[] = [];
  let nuts: any[] = [];
  let eggs: any[] = [];

  useEffect(() => {
    const allergensContainedSet = [
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
      selectedAllergies.filter((a) => !allergensContainedSet.includes(a))
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

    const finalDescription =
      groupedDescriptions.length > 1
        ? groupedDescriptions.slice(0, -1).join(", ") +
          ", and " +
          groupedDescriptions.slice(-1)
        : groupedDescriptions[0];
    setAllergensContained(finalDescription);
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
          .
        </p>
      )}
      <div
        id="otherAllergensInput"
        contentEditable={true}
        suppressContentEditableWarning={true}
        onInput={(e) => {
          const text = e.currentTarget.textContent?.trim();

          // If the text is empty, clear any residual markup (like a stray <br>)
          if (text === "") {
            e.currentTarget.innerHTML = "";
          }

          // Update your state with the current text
          setCookieSelection((prev: any) => ({
            ...prev,
            otherAllergens: text,
          }));
        }}
        className={styles.allergyInput}
        // Optional: use a data attribute for reusability
        data-placeholder="Other Allergens/Special Requests"
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
    price: 40,
    selectedAllergies: [] as string[],
    otherAllergens: "",
    mixins: [] as Mixins[],
  });

  const [allergensContained, setAllergensContained] = useState("");

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
        price: cookieSelection.price,
        selectedAllergies: cookieSelection.selectedAllergies,
        otherAllergens: cookieSelection.otherAllergens,
        mixins: cookieSelection.mixins,
      },
      quantity: 1,
    };
    setCart((prev) => [...prev, newItem]);
  };

  const calculateTotalPrice = (basePrice: number, mixins: Mixins[]) => {
    let total = basePrice;
    mixins.forEach((m) => {
      const details = getMixinDetails(m);
      total += details.price || 0;
    });
    return total;
  };

  const allMixinsDetails = getAllMixins().map((m) => getMixinDetails(m));

  const flavorOptions = [
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
                  price: flavor.price,
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
                style={{ backgroundImage: `url("/${m.value}.jpg")` }}
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
        </div>
      </div>
      <div id="allergySection" className={styles.allergySection}>
        {/* Render the allergen options inline */}
        <AllergySection
          allergensContained={allergensContained}
          setAllergensContained={setAllergensContained}
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
      </div>
      <div id="reviewSection" className={styles.reviewSection}>
        <h1 className={styles.reviewTitle}>Review Your Order</h1>
        <div className={styles.reviewDetails}>
          <p>
            Flavor:{" "}
            {
              flavorOptions.find(
                (flavor) => flavor.value === cookieSelection.flavor
              )?.name
            }
          </p>
          <p>Price: ${cookieSelection.price}</p>
          <p>
            Mixins:{" "}
            {cookieSelection.mixins.length > 0
              ? cookieSelection.mixins
                  .map(
                    (item) =>
                      convertNameToTitleCase(getMixinDetails(item).name) +
                      (getMixinDetails(item).price &&
                      getMixinDetails(item).price > 0
                        ? ` ($${getMixinDetails(item).price.toFixed(2)})`
                        : " (Free)")
                  )
                  .join(", ")
              : "No mixins"}
          </p>
          <p>
            Allergy Warning:{" "}
            {allergensContained
              ? allergensContained.substring(0, 1).toUpperCase() +
                allergensContained
                  .replace(/contain/, "will contain")
                  .substring(1)
              : "None"}
          </p>
          <p>
            This Product Contains:{" "}
            {[
              ...[
                ...cookieFlavorAllergens[
                  cookieSelection.flavor as keyof typeof cookieFlavorAllergens
                ],
                ...cookieSelection.mixins
                  .map((m) => {
                    return getMixinDetails(m).allergens || [];
                  })
                  .reduce((acc, curr) => {
                    return [...acc, ...curr];
                  }, [])
                  .filter((item, index, arr) => {
                    return arr.indexOf(item) === index;
                  }),
              ]
                .filter(
                  (item) => !cookieSelection.selectedAllergies.includes(item)
                )
                .filter((item, index, arr) => {
                  return arr.indexOf(item) === index;
                }),
            ].length > 0
              ? [
                  ...cookieFlavorAllergens[
                    cookieSelection.flavor as keyof typeof cookieFlavorAllergens
                  ],
                  ...cookieSelection.mixins
                    .map((m) => {
                      return getMixinDetails(m).allergens || [];
                    })
                    .reduce((acc, curr) => {
                      return [...acc, ...curr];
                    }, [])
                    .filter((item, index, arr) => {
                      return arr.indexOf(item) === index;
                    }),
                ]
                  .filter(
                    (item) => !cookieSelection.selectedAllergies.includes(item)
                  )
                  .filter((item, index, arr) => {
                    return arr.indexOf(item) === index;
                  })
                  .map((i) => i.substring(0, 1).toUpperCase() + i.substring(1))
                  .join(", ")
              : "No allergens"}
          </p>
          {cookieSelection.otherAllergens && (
            <p>
              Other Allergens/Special Requests: {cookieSelection.otherAllergens}
            </p>
          )}
          <p className={styles.reviewTotal}>
            Total Price: $
            {calculateTotalPrice(cookieSelection.price, cookieSelection.mixins)}
          </p>
        </div>
        <button
          onClick={() => handleAddToCart()}
          className={styles.addToCartButton}
        >
          Add to Cart
        </button>
      </div>
    </>
  );
};
