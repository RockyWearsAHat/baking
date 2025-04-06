import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const Root: FC = () => {
  return (
    <>
      <Navbar />

      <Outlet />
    </>
  );
};
