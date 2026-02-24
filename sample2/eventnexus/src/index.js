import React from "react";
import ReactDOM from "react-dom/client";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "./styles/globals.css";
import App from "./App";

/**
 * src/index.js — React 18 entry point
 * ─────────────────────────────────────────────
 * Renders <App /> (BrowserRouter + all routes) into #root.
 *
 * Previously rendered <LandingPage /> directly.
 * Now renders <App /> so React Router handles page routing.
 */

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);