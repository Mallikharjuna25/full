import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage  from "./LandingPage";
import CalendarPage from "./CalendarPage";

/**
 * App.js — Root router
 * ─────────────────────────────────────────────
 * Connects all top-level pages via React Router v6.
 *
 * Routes:
 *   /          → LandingPage   (hero, events, features, etc.)
 *   /calendar  → CalendarPage  (full interactive event calendar)
 *   *          → redirect to /
 *
 * As the project grows, add new routes here:
 *   /login, /signup, /host-event, /my-events, /profile, /admin
 */
const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/"         element={<LandingPage  />} />
      <Route path="/calendar" element={<CalendarPage />} />

      {/* Catch-all → home */}
      <Route path="*"         element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;