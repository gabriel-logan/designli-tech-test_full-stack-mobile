import apiInstance from "../../lib/api";
import type { StockAlert } from "../../types/api";

export async function getAlerts() {
  const { data } = await apiInstance.get<StockAlert[]>("/alerts");

  return data;
}
