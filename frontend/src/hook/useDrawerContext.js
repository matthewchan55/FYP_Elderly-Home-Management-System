import { DrawerContext } from "../context/DrawerContext";
import { useContext } from "react";

export const useDrawerContext = () => {
  const context = useContext(DrawerContext);

  if (!context) {
    throw Error("useDrawerContext must be used inside an AuthContextProvider");
  }

  return context;
};
