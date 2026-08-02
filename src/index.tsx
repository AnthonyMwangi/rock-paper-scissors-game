import { AppContextProvider } from "@/context";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./styles/index.scss";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </StrictMode>,
);
