import apiInstance from "../../lib/api";
import type {
  CreateAlertRequest,
  StockAlert,
  UpdateAlertRequest,
} from "../../types/api";

export async function createAlert(payload: CreateAlertRequest) {
  const { data } = await apiInstance.post<StockAlert>("/alerts", payload);

  return data;
}

export async function updateAlert({
  id,
  ...payload
}: UpdateAlertRequest & { id: string }) {
  const { data } = await apiInstance.patch<StockAlert>(
    `/alerts/${id}`,
    payload,
  );

  return data;
}

export async function deleteAlert(id: string) {
  await apiInstance.delete<void>(`/alerts/${id}`);
}
