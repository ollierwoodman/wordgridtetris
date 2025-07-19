import { useEffect } from "react";
import { useTheme as useThemeStorage } from "./useLocalStorage";

type Theme = "light" | "dark" | "system";

export const useTheme = () => {
  const [theme, setTheme] = useThemeStorage();

  const getNextTheme = (currentTheme: Theme): Theme => {
    if (currentTheme === "system") {
      return "light";
    } else if (currentTheme === "light") {
      return "dark";
    } else {
      return "system";
    }
  };

  const applyTheme = (newTheme: Theme) => {
    if (newTheme === "system") {
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
    setTheme(newTheme);
  };

  const cycleTheme = () => {
    const nextTheme = getNextTheme(theme);
    applyTheme(nextTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    applyTheme(theme);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for system theme changes when using system theme
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        document.documentElement.classList.toggle("dark", mediaQuery.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [theme]);

  return {
    theme,
    setTheme: applyTheme,
    cycleTheme,
    getNextTheme,
  };
};
