import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { FlashProvider } from "./context/FlashContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <FlashProvider>
        <App />
      </FlashProvider>
    </BrowserRouter>
  </StrictMode>
);
