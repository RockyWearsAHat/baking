import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Order } from "./pages/Order";
import { createBrowserRouter } from "react-router";
import { Product } from "./pages/Product";
import { Cart } from "./pages/Cart";

export const Router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "order", Component: Order },
      { path: "products/:item", Component: Product },
      { path: "products", Component: Product },
      { path: "cart", Component: Cart },
    ],
  },
]);
