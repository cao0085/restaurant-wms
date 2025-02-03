import { createContext, useContext, useEffect, useState } from "react";

// 建立 Context
const ThemeContext = createContext();

// 提供者（全局管理主題狀態）
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 自訂 Hook 讓組件更方便存取
export function useTheme() {
  return useContext(ThemeContext);
}