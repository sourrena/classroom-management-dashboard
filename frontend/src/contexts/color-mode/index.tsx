import { ConfigProvider, theme } from "antd";
import type { PropsWithChildren } from "react";
import { createContext, useEffect, useMemo, useState } from "react";

type ColorMode = "light" | "dark";

type ColorModeContextType = {
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
};

export const ColorModeContext = createContext({} as ColorModeContextType);

export const ColorModeContextProvider = ({ children }: PropsWithChildren) => {
  const getInitialMode = (): ColorMode => {
    const storedMode = localStorage.getItem("colorMode");

    if (storedMode === "light" || storedMode === "dark") {
      return storedMode;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    return prefersDark ? "dark" : "light";
  };

  const [mode, setMode] = useState<ColorMode>(getInitialMode);

  useEffect(() => {
    localStorage.setItem("colorMode", mode);
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const antdTheme = useMemo(
    () => ({
      algorithm:
        mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: "#10b981",
        borderRadius: 10,
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        colorBgLayout: mode === "dark" ? "#0f1115" : "#f6f8fb",
        colorBgContainer: mode === "dark" ? "#171717" : "#ffffff",
        colorBorder: mode === "dark" ? "#2a2a2a" : "#e5e7eb",
      },
      components: {
        Layout: {
          bodyBg: mode === "dark" ? "#0f1115" : "#f6f8fb",
          headerBg: mode === "dark" ? "#171717" : "#ffffff",
          siderBg: mode === "dark" ? "#07111f" : "#07111f",
        },
        Card: {
          colorBgContainer: mode === "dark" ? "#171717" : "#ffffff",
        },
        Table: {
          headerBg: mode === "dark" ? "#1f1f1f" : "#f9fafb",
        },
      },
    }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={{ mode, setMode }}>
      <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>
    </ColorModeContext.Provider>
  );
};