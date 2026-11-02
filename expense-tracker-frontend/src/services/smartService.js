import api from "./api";
export const getSmartInsights = async () => (await api.get("/smart/insights")).data;
export const getExchangeRates = async (base = "INR") => (await api.get("/smart/exchange-rates", { params: { base } })).data;
export const askBudgetAdvice = async (question) => (await api.post("/smart/budget-advice", {
  question,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
})).data;
