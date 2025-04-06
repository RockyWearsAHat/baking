import { FC } from "react";
import { Helmet } from "react-helmet-async";

export const About: FC = () => {
  return (
    <>
      <Helmet>
        <title>About | SLC Baking Co.</title>
      </Helmet>
      <div>
        <h1>About Page</h1>
        <p>Welcome to the about page. Place your order below!</p>
      </div>
    </>
  );
};
