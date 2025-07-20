import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SoundProvider } from "./utils/sounds.tsx";
import { Toaster } from "sonner";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

createRoot(rootElement).render(
  <StrictMode>
    <SoundProvider>
      <App />
      <Toaster />
    </SoundProvider>
  </StrictMode>
);
