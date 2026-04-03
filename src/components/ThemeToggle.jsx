import React from "react";
import { useAppState } from "../context/AppStateContext";

export function ThemeToggle() {
  const { theme, dispatch } = useAppState();
  return (
    <button
      className="btn btn-secondary"
      onClick={() => dispatch({ type: "setTheme", payload: theme === "light" ? "dark" : "light" })}
      type="button"
    >
      {theme === "light" ? "Dark mode" : "Light mode"}
    </button>
  );
}

