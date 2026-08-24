import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./app/App";
import store from "./store";
import "./styles/index.css";

// No StrictMode: react-beautiful-dnd v13 double-invokes its way into "Unable to find draggable"
// under React 18 strict mode, which breaks the board. Removing it is the price of that library.
//
// A second, conflicting ThemeProvider used to wrap this too; the inner one in App always won,
// so it only ever added confusion.
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
