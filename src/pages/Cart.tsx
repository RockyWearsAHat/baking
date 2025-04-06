import { FC, useEffect } from "react";
import styles from "../styles/Checkout.module.css";
import { Helmet } from "react-helmet-async";
import { useLocalStorage } from "../hooks/useLocalStorage";

import { ICartItem } from "../types/Types";

export const Cart: FC = () => {
  const { storedValue: cartItems, setValue: setCartItems } = useLocalStorage<
    ICartItem[]
  >("cart", []);

  const handleCheckout = () => {
    // Handle checkout logic here
    // For example, you can send the cart items to a server or process the payment
    console.log("Checking out with items:", cartItems);
    setCartItems([]);
  };

  useEffect(() => {
    console.log("Cart items:", cartItems);
  }, [cartItems]);

  return (
    <>
      <Helmet>
        <title>Checkout | SLC Baking Co.</title>
      </Helmet>
      <div className={styles.checkoutWrapper}>
        <h1>Checkout</h1>
        <button
          onClick={() =>
            cartItems.length == 0
              ? setCartItems([
                  {
                    item: {
                      type: "cookies",
                      flavor: "chocolateChip",
                    },
                    quantity: 1,
                  },
                ])
              : setCartItems([
                  {
                    ...cartItems[0],
                    quantity: cartItems[0].quantity + 1,
                  },
                ])
          }
        >
          Add to cart
        </button>
        {cartItems.length == 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className={styles.cartItemsWrapper}>
              {cartItems.map((item, index) => (
                <div key={index} className={styles.cartItem}>
                  <h2>
                    {item.item.type.substring(0, 1).toUpperCase() +
                      item.item.type.substring(1)}
                  </h2>
                  <img src="./CC-Cookie.jpg" alt="" />
                  <p>Quantity: {item.quantity}</p>
                </div>
              ))}
            </div>
            <button onClick={handleCheckout} className={styles.checkoutButton}>
              Checkout
            </button>
          </>
        )}
      </div>
    </>
  );
};
