import { defaultCssVariables } from '@event-platform/config/tailwind/tokens';
import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';

export type ThemeVariables = Partial<typeof defaultCssVariables>;

type ThemeContextValue = {
  variables: ThemeVariables;
};

const ThemeContext = createContext<ThemeContextValue>({
  variables: defaultCssVariables,
});

export type ThemeProviderProps = {
  children: ReactNode;
  variables?: ThemeVariables;
};

export function ThemeProvider({ children, variables = {} }: ThemeProviderProps) {
  const merged = useMemo(() => ({ ...defaultCssVariables, ...variables }), [variables]);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(merged).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [merged]);

  return <ThemeContext.Provider value={{ variables: merged }}>{children}</ThemeContext.Provider>;
}

export function useThemeVariables(): ThemeVariables {
  return useContext(ThemeContext).variables;
}
