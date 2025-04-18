import { FC, useEffect, useState } from "react";
import { CookieFlavor } from "../types/Cookies";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ICartItem } from "../types/Types";
import styles from "../styles/CookieOrderPage.module.css";
import { getAllMixins, getMixinDetails, Mixins } from "../types/Mixins";
import { CiWheat } from "react-icons/ci";
import { LuEgg, LuMilk } from "react-icons/lu";
import { GiPeanut } from "react-icons/gi";
import { IoIosArrowDown } from "react-icons/io";

import { flavors, cookieFlavorAllergens } from "../data/CookieFlavors";

const allergyOptions = [
  { value: "gluten", label: "Gluten Free", icon: <CiWheat /> },
  { value: "dairy", label: "Dairy Free", icon: <LuMilk /> },
  { value: "peanuts", label: "Nut Free", icon: <GiPeanut /> },
  { value: "eggs", label: "Egg Free", icon: <LuEgg /> },
];

// Convert "Ghirhadelli white chocolate chips" => "Ghirhadelli White Chocolate Chips"
const toTitleCase = (text: string) =>
  text.replace(/(^\w)|([-\s]\w)/g, (m) => m.toUpperCase());

/* --------------------------------
   A simpler helper for describing
   which allergens are introduced 
   by a set of Mixins
-------------------------------- */
function describeAllergens(mixins: Mixins[]): string {
  const result = new Set<string>();
  mixins.forEach((m) => {
    const details = getMixinDetails(m);
    details.allergens?.forEach((a) => result.add(a));
  });
  if (!result.size) return "";
  // E.g. "Chocolate Chips contain dairy, peanuts"
  // (optional grouping can be omitted for clarity)
  const arr = Array.from(result);
  if (arr.length === 1) return `${arr[0]}`;
  return arr.slice(0, -1).join(", ") + " and " + arr.slice(-1);
}

/* --------------------------------
   Render allergy selection
-------------------------------- */
interface AllergySectionProps {
  selectedAllergies: string[];
  onChangeAllergies: (allergies: string[]) => void;
  allergensContained: string;
  mixins: Mixins[];
  allergenWarning: string;
  onOtherAllergensChange: (value: string) => void;
  scrollToSection: (id: string) => void;
  flavor: CookieFlavor; // Added
}

const AllergySection: FC<AllergySectionProps> = ({
  selectedAllergies,
  onChangeAllergies,
  mixins,
  // allergenWarning,
  allergensContained,
  onOtherAllergensChange,
  scrollToSection,
  flavor, // Destructure the new prop
}) => {
  // Disable an option if any mixin reintroduces that allergen
  const isDisabled = (opt: string) =>
    mixins.some((m) => getMixinDetails(m).allergens?.includes(opt) ?? false);

  useEffect(() => {
    console.log(allergensContained);
  }, [allergensContained]);

  // Use the flavor prop directly
  const defaultAllergens = cookieFlavorAllergens[flavor];
  const isCookieDefaultAllergen = (value: string) =>
    defaultAllergens.includes(value);

  return (
    <div className={styles.allergySectionWrapper}>
      <h1 className={styles.allergyTitle}>Allergies & Special Instructions</h1>

      <div className={styles.allergyCardsWrapper}>
        {allergyOptions.map((opt) => {
          const defaultAllergy = isCookieDefaultAllergen(opt.value);
          return (
            <div
              key={opt.value}
              className={
                (selectedAllergies.includes(opt.value)
                  ? styles.selectedAllergy
                  : "") +
                " " +
                (isDisabled(opt.value) ? styles.disabledAllergy : "") +
                " " +
                styles.allergyCard +
                " " +
                (defaultAllergy ? styles.defaultAllergy : "")
              }
              onClick={() => {
                if (!isDisabled(opt.value)) {
                  onChangeAllergies(
                    selectedAllergies.includes(opt.value)
                      ? selectedAllergies.filter((a) => a !== opt.value)
                      : [...selectedAllergies, opt.value]
                  );
                }
              }}
            >
              {opt.icon}
              <span style={{ paddingLeft: "5px" }}>{opt.label}</span>
            </div>
          );
        })}
      </div>

      {(defaultAllergens.filter((val) => !selectedAllergies.includes(val))
        .length > 0 ||
        allergensContained) && (
        <p className={styles.allergyWarning}>
          <span style={{ textDecoration: "underline", fontWeight: "bold" }}>
            ALLERGEN WARNING
          </span>
          : {allergensContained}
        </p>
      )}

      <div
        id="otherAllergensInput"
        contentEditable
        suppressContentEditableWarning
        onInput={(e) =>
          onOtherAllergensChange(e.currentTarget.textContent?.trim() || "")
        }
        className={styles.allergyInput}
        data-placeholder="Other Allergens/Special Requests"
      />

      <div
        onClick={() => scrollToSection("reviewSection")}
        className={styles.nextSectionButton}
      >
        <IoIosArrowDown />
      </div>
    </div>
  );
};

/* --------------------------------
   Main CookieOrderPage
-------------------------------- */
export const CookieOrderPage: FC = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  const [cookieSelection, setCookieSelection] = useState({
    flavor: "chocolateChip" as CookieFlavor,
    price: 40,
    selectedAllergies: [] as string[],
    otherAllergens: "",
    mixins: [] as Mixins[],
  });

  const { setValue: setCart } = useLocalStorage<ICartItem[]>("cart", []);

  // Calculate which allergens come from Mixins
  const allergenString = describeAllergens(cookieSelection.mixins);

  // Remove conflicts from selectedAllergies if the mixin reintroduces them
  useEffect(() => {
    setCookieSelection((prev) => ({
      ...prev,
      selectedAllergies: prev.selectedAllergies.filter(
        (a) => !allergenString.includes(a)
      ),
    }));
  }, [cookieSelection.mixins]);

  useEffect(() => {
    const baseAllergens = cookieFlavorAllergens[cookieSelection.flavor].filter(
      (a) => !cookieSelection.selectedAllergies.includes(a)
    );
    const updatedAllergies = new Set(cookieSelection.selectedAllergies);
    const mixinAllergens: Record<string, string[]> = {};

    cookieSelection.mixins.forEach((m) => {
      const details = getMixinDetails(m);
      const filtered = (details.allergens || []).filter(
        (a) => !updatedAllergies.has(a)
      );
      (details.allergens || []).forEach((a) => {
        if (updatedAllergies.has(a)) updatedAllergies.delete(a);
      });
      if (filtered.length) {
        mixinAllergens[m] = filtered;
      }
    });

    // Compare old vs. new allergies to avoid infinite re-render
    const newAllergiesArray = Array.from(updatedAllergies).sort();
    const oldAllergiesArray = [...cookieSelection.selectedAllergies].sort();
    if (
      JSON.stringify(newAllergiesArray) !== JSON.stringify(oldAllergiesArray)
    ) {
      setCookieSelection((prev) => ({
        ...prev,
        selectedAllergies: newAllergiesArray,
      }));
    }

    const segments: string[] = [];
    if (baseAllergens.length) {
      segments.push(`This recipe contains ${baseAllergens.join(", ")}`);
    }
    Object.entries(mixinAllergens).forEach(([mixinName, allergens]) => {
      if (allergens.length) {
        segments.push(
          `${
            getMixinDetails(mixinName as Mixins).name
          } contains ${allergens.join(", ")}`
        );
      }
    });

    setAllergensContained(segments.join(", and "));
  }, [
    cookieSelection.flavor,
    cookieSelection.mixins,
    cookieSelection.selectedAllergies,
  ]);

  /* --------------------------------
     Helpers
  -------------------------------- */
  const toggleMixin = (m: Mixins) =>
    setCookieSelection((prev) => ({
      ...prev,
      mixins: prev.mixins.includes(m)
        ? prev.mixins.filter((x) => x !== m)
        : [...prev.mixins, m],
    }));

  const totalPrice = cookieSelection.mixins.reduce(
    (sum, m) => sum + (getMixinDetails(m).price || 0),
    cookieSelection.price
  );

  const addToCart = () => {
    const newItem: ICartItem = {
      item: {
        type: "cookies",
        flavor: cookieSelection.flavor,
        price: cookieSelection.price,
        selectedAllergies: cookieSelection.selectedAllergies,
        otherAllergens: cookieSelection.otherAllergens,
        mixins: cookieSelection.mixins,
      },
      quantity: 1,
    };
    setCart((prev) => [...prev, newItem]);
  };

  const scrollToSection = (id: string) =>
    window.scrollTo({
      top: document.getElementById(id)?.offsetTop! - 62,
      behavior: "smooth",
    });

  const [allergensContained, setAllergensContained] = useState<string>("");

  /* --------------------------------
     UI
  -------------------------------- */
  return (
    <>
      {/* Flavor Selection */}
      <div className={styles.orderPageFlavorWrapper}>
        <h1 className={styles.flavorTitle}>Base Flavor</h1>
        <div className={styles.flavorCardsWrapper}>
          {flavors.map((f) => (
            <div
              key={f.value}
              onClick={() => {
                setCookieSelection({
                  ...cookieSelection,
                  flavor: f.value as CookieFlavor,
                  price: f.price,
                });
                scrollToSection("mixinSection");
              }}
              className={
                (cookieSelection.flavor === f.value
                  ? styles.selectedFlavorCard
                  : "") +
                " " +
                styles.flavorCard
              }
            >
              <img src={`/${f.image}`} alt={f.name} />
              <p>{f.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mixin Selection */}
      <div className={styles.mixinSection} id="mixinSection">
        <div className={styles.mixinTitle}>
          <h1>Add your mixins</h1>
          <p className={styles.mixinSubtext}>Additional charges may apply.</p>
        </div>

        <div className={styles.mixinWrapper}>
          {getAllMixins().map((m) => (
            <div key={m} className={styles.mixinCard}>
              <label
                className={styles.mixinLabel}
                style={{ backgroundImage: `url("/${m}.jpg")` }}
              >
                <input
                  type="checkbox"
                  checked={cookieSelection.mixins.includes(m)}
                  onChange={() => toggleMixin(m)}
                  style={{ display: "none" }}
                />
                <div
                  className={styles.mixinPrice}
                  data-price={
                    getMixinDetails(m).price > 0
                      ? `$${getMixinDetails(m).price}`
                      : "Free"
                  }
                ></div>
              </label>
              <div className={styles.mixinDetails}>
                {toTitleCase(getMixinDetails(m).name)}
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

      {/* Allergy Selection */}
      <div id="allergySection" className={styles.allergySection}>
        <AllergySection
          selectedAllergies={cookieSelection.selectedAllergies}
          onChangeAllergies={(allergies) =>
            setCookieSelection({
              ...cookieSelection,
              selectedAllergies: allergies,
            })
          }
          allergensContained={allergensContained}
          mixins={cookieSelection.mixins}
          allergenWarning={allergenString || ""}
          onOtherAllergensChange={(val) =>
            setCookieSelection({ ...cookieSelection, otherAllergens: val })
          }
          scrollToSection={scrollToSection}
          flavor={cookieSelection.flavor} // Added
        />
      </div>

      {/* Review Section */}
      <div id="reviewSection" className={styles.reviewSection}>
        <h1 className={styles.reviewTitle}>Review Your Order</h1>
        <div className={styles.reviewDetails}>
          <p>
            Flavor:{" "}
            {flavors.find((f) => f.value === cookieSelection.flavor)?.name}
          </p>
          <p>
            Mixins:{" "}
            {cookieSelection.mixins.length
              ? cookieSelection.mixins
                  .map((m) => toTitleCase(getMixinDetails(m).name))
                  .join(", ")
              : "None"}
          </p>
          <p>
            Contains:{" "}
            {[
              ...cookieFlavorAllergens[cookieSelection.flavor],
              ...cookieSelection.mixins.flatMap(
                (m) => getMixinDetails(m).allergens || []
              ),
            ]
              // Exclude user-omitted allergens
              .filter((a, idx, arr) => arr.indexOf(a) === idx)
              .filter((a) => !cookieSelection.selectedAllergies.includes(a))
              .map((a) => a.charAt(0).toUpperCase() + a.slice(1))
              .join(", ") || "No allergens"}
          </p>
          {cookieSelection.otherAllergens && (
            <p>Other Requests: {cookieSelection.otherAllergens}</p>
          )}
          <p className={styles.reviewTotal}>Total Price: ${totalPrice}</p>
        </div>

        <button onClick={addToCart} className={styles.addToCartButton}>
          Add to Cart
        </button>
      </div>
    </>
  );
};
