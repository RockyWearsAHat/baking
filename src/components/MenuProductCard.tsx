import { FC } from "react";
import { Link } from "react-router";
import styles from "../styles/MenuProductCard.module.css";
import { IMenuProductCard } from "../types/Types";

export const MenuProductCard: FC<IMenuProductCard> = (
  product: IMenuProductCard
) => {
  return (
    <Link to={product.link}>
      <div className={styles.menuProductCard}>
        <div
          className={styles.blurBackground}
          style={{ backgroundImage: `url(./${product.imageName})` }}
        />
        <div className={styles.menuProductCardContent}>
          <h2 className={styles.menuProductCardText}>{product.name}</h2>
        </div>
      </div>
    </Link>
  );
};
