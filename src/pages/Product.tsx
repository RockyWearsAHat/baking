import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, useParams } from "react-router-dom";

const cookieTypes: Array<string> = [
  "chocolate chip",
  "oatmeal raisin",
  "peanut butter",
  "snickerdoodle",
];

const cookieAndBrownieMixins: Array<string> = [
  "chocolate chips",
  "walnuts",
  "pecans",
  "peanut butter chips",
  "butterscotch chips",
  "white chocolate chips",
  "coconut",
  "M&M's",
  "butterfinger pieces",
];

interface IItem {
  types: Array<string>;
  mixins: Array<string>;
  toppings: Array<string>;
  fillings: Array<string>;
  frostings: Array<string>;
}

const items: Record<string, Partial<IItem>> = {
  cookies: { types: [...cookieTypes], mixins: [...cookieAndBrownieMixins] },
  brownies: { mixins: [...cookieAndBrownieMixins] },
};

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
      <div>
        <h1>{`${item?.substring(0, 1).toUpperCase()}${item?.substring(1)}`}</h1>
      </div>
    </>
  );
};
