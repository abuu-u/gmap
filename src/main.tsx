import { APIProvider } from "@vis.gl/react-google-maps";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./globals.css";
import { store } from "./store.ts";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

if (!API_KEY) {
  throw new Error(
    "Missing Google Maps API key. Create VITE_GOOGLE_API_KEY in .env.local"
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <APIProvider apiKey={API_KEY}>
        <App />
      </APIProvider>
    </Provider>
  </React.StrictMode>
);
