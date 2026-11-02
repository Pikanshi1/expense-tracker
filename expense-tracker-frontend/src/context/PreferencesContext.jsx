/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getExchangeRates } from "../services/smartService";
const PreferencesContext = createContext(null);
export function PreferencesProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("app-theme") || "dark");
  const [currency, setCurrency] = useState(() => localStorage.getItem("app-currency") || "INR");
  const [rates, setRates] = useState({ INR: 1 });
  const [rateDate, setRateDate] = useState(null);
  useEffect(() => { localStorage.setItem("app-theme", theme); document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => { localStorage.setItem("app-currency", currency); }, [currency]);
  useEffect(() => { let active = true; getExchangeRates("INR").then(data => { if (active) { setRates({ INR: 1, ...(data.rates || {}) }); setRateDate(data.date); } }).catch(() => {}); return () => { active = false; }; }, []);
  const value = useMemo(() => ({
    theme, setTheme, toggleTheme: () => setTheme(v => v === "dark" ? "light" : "dark"), currency, setCurrency,
    formatCurrency(amount, options = {}) {
      const converted = Number(amount || 0) * (currency === "INR" ? 1 : (rates[currency] || 1));
      try { return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2, ...options }).format(converted); }
      catch { return `${currency} ${converted.toFixed(2)}`; }
    }, rateDate,
  }), [theme, currency, rates, rateDate]);
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
export function usePreferences() { const value = useContext(PreferencesContext); if (!value) throw new Error("usePreferences must be used inside PreferencesProvider"); return value; }
