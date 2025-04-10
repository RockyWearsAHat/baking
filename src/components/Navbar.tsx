import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import { IoCart } from "react-icons/io5";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ICartItem } from "../types/Types";

export const Navbar: FC = () => {
  const { storedValue: cartItems } = useLocalStorage<ICartItem[]>("cart", []);

  const [itemCount, setItemCount] = useState<number>(0);

  useEffect(() => {
    let count = 0;

    cartItems.forEach((item) => {
      count += item.quantity;
    });

    setItemCount(count);
  }, [cartItems]);

  return (
    <nav className={styles.navbarWrapper}>
      <ul className={styles.navbarList}>
        <li
          data-count={itemCount > 9 ? "9+" : itemCount}
          className={`${styles.navbarGrowItem} ${
            itemCount <= 0
              ? ``
              : `${
                  itemCount > 9
                    ? `${styles.navbarBeforeAfter} ${styles.navbarCartIconNinePlus}`
                    : `${styles.navbarBeforeAfter}`
                }`
          }`}
        >
          <Link to="/cart">
            <IoCart className={styles.navbarCartIcon} />
          </Link>
        </li>
        <img
          src="/logo.png"
          alt=""
          style={{
            width: "80px",
            height: "80px",
            position: "absolute",
            top: "-11px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/order">Order</Link>
        </li>
      </ul>
    </nav>
  );
};
