import { createContext, useReducer } from "react";

export const DrawerContext = createContext();

export const drawerReducer = (state, action) => {
  switch (action.type) {
    case "OPEN":
      return {
        open: true,
      };
    case "CLOSE":
      return {
        open: false,
      };
    default:
      return state;
  }
};

export const DrawerContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(drawerReducer, {
    open: false,
  });

  console.log("DrawerContext state: ", state);

  return (
    <DrawerContext.Provider value={{ ...state, dispatch }}>
      {children}
    </DrawerContext.Provider>
  );
};
