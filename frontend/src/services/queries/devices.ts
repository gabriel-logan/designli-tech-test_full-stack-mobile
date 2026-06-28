import apiInstance from "../../lib/api";
import type { UserDevice } from "../../types/api";

export async function getDevices() {
  const { data } = await apiInstance.get<UserDevice[]>("/devices");

  return data;
}
