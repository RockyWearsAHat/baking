import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, useParams } from "react-router-dom";
import { CookieOrderPage } from "../components/CookieOrderPage";

export const Product: FC = () => {
  const { item } = useParams<{ item: string }>();

  console.log(item);

  if (!item) return <Navigate to="/" />;

  return (
    <>
      <Helmet>
        <title>
          {`${item?.substring(0, 1).toUpperCase()}${item?.substring(1)}`} | SLC
          Baking Co.
        </title>
      </Helmet>
      {item == "cookies" && <CookieOrderPage />}
    </>
  );
};
