import { createContext, useContext, useState, ReactNode } from "react";

interface AccessibilitySettings {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  useDyslexicFont: boolean;
  fontFamily: string;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  update: (partial: Partial<AccessibilitySettings>) => void;
}

const defaults: AccessibilitySettings = {
  fontSize: 18,
  letterSpacing: 2,
  lineHeight: 1.8,
  useDyslexicFont: true,
  fontFamily: "OpenDyslexic",
};

const AccessibilityContext = createContext<AccessibilityContextType>({
  settings: defaults,
  update: () => {},
});

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem("dl-accessibility");
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch {
      return defaults;
    }
  });

  const update = (partial: Partial<AccessibilitySettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem("dl-accessibility", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AccessibilityContext.Provider value={{ settings, update }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
