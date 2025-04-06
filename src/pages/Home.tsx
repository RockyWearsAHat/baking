import { FC } from "react";
import styles from "../styles/Home.module.css";
import { IoIosArrowDown } from "react-icons/io";
import { Helmet } from "react-helmet-async";
import { MenuProductCard } from "../components/MenuProductCard";

import { productCards } from "../data/Products";

export const Home: FC = () => {
  return (
    <>
      <Helmet>
        <title>Home | SLC Baking Co.</title>
      </Helmet>
      <div className={styles.homeWrapper}>
        <div className={styles.firstSectionWrapper}>
          <div className={styles.firstSectionTextWrapper}>
            <h1>Welcome to the Salt Lake Baking Company!</h1>
            <h1>We craft fresh artisan pasteries every day.</h1>
            <h1>Explore our menu below and place your order now.</h1>
          </div>
          <div className={styles.scrollDown}>
            <IoIosArrowDown />
            <IoIosArrowDown />
            <IoIosArrowDown />
          </div>
        </div>
        <div className={styles.secondSectionWrapper}>
          {productCards.map((product) => (
            <MenuProductCard
              key={product.name}
              name={product.name}
              link={product.link}
              imageName={product.imageName}
            />
          ))}
        </div>
      </div>
    </>
  );
};
