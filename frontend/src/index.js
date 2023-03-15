import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { DrawerContextProvider } from "./context/DrawerContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <DrawerContextProvider>
        <App />
      </DrawerContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
