import { createContext, useContext, useEffect, ReactNode } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

interface DarkModeProviderProps {
  children: ReactNode;
}

//全局上下文文件，先创建上下文
const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined,
);

function DarkModeProvider({ children }: DarkModeProviderProps) {
  // const [isDarkMode, setIsDarkMode] = useLocalStorageState(false, "isDarkMode");
  // 获取用户操作系统的当前主题偏好
  const isSystemDark = window?.matchMedia?.(
    "(prefers-color-scheme: dark)",
  )?.matches;
  const [isDarkMode, setIsDarkMode] = useLocalStorageState<boolean>(
    isSystemDark,
    "isDarkMode",
  );

  useEffect(
    function () {
      if (isDarkMode) {
        document.documentElement.classList.add("dark-mode");
        document.documentElement.classList.remove("light-mode");
      } else {
        document.documentElement.classList.add("light-mode");
        document.documentElement.classList.remove("dark-mode");
      }
    },
    [isDarkMode],
  );

  function toggleDarkMode() {
    setIsDarkMode((isDark) => !isDark);
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

//再创建自定义hook，用于消费上下文
function useDarkMode() {
  const context = useContext(DarkModeContext);

  if (context === undefined)
    throw new Error("DarkModeContext was used outside of DarkModeProvider");

  return context;
}

//最后全部命名导出
export { DarkModeProvider, useDarkMode };
