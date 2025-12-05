import React, { useState, useEffect } from "react";

const ThemeToggle = () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  const [theme, setTheme] = useState(savedTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="theme-toggle-wrapper">
      <div className="theme-tooltip">
        {theme === "light" ? "Modo oscuro" : "Modo claro"}
      </div>

      <div className="theme-toggle" onClick={toggleTheme}>
        <span className="icon">{theme === "dark" ? "🌙" : "☀️"}</span>
      </div>
    </div>
  );
};

export default ThemeToggle;
