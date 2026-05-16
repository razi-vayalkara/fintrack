import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./store/store";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#fff",
            border: "1px solid #f3f4f6",
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
            color: "#374151",
            fontSize: "14px",
            borderRadius: "0.75rem"
          }
        }}
      />
    </Provider>
  </React.StrictMode>
);
