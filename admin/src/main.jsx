import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App.jsx";
import { ModalProvider } from "./pages/ModalContext";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ModalProvider>
        <App />
        <ToastContainer position="top-right" autoClose={4000} />
      </ModalProvider>
    </BrowserRouter>
  </StrictMode>
);
