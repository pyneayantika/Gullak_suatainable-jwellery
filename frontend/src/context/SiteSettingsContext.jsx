import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";

const SiteSettingsContext = createContext({ header_logo_size: 72 });

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState({ header_logo_size: 72 });

  useEffect(() => {
    api.get("/site-content")
      .then(r => {
        if (r.data?.header_logo_size) {
          setSettings(s => ({ ...s, header_logo_size: r.data.header_logo_size }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
