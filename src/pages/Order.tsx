import { FC } from "react";
import { Helmet } from "react-helmet-async";

export const Order: FC = () => {
  return (
    <>
      <Helmet>
        <title>Order | SLC Baking Co.</title>
      </Helmet>
      <div>
        <h1>Order Page</h1>
        <p>Welcome to the Order page. Place your order below!</p>
      </div>
    </>
  );
};
