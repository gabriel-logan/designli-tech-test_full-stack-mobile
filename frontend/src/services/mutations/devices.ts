import apiInstance from "../../lib/api";
import type { RegisterDeviceRequest, UserDevice } from "../../types/api";

export async function registerDevice(payload: RegisterDeviceRequest) {
  const { data } = await apiInstance.post<UserDevice>("/devices", payload);

  return data;
}

export async function deleteDevice(payload: RegisterDeviceRequest) {
  await apiInstance.delete<void>("/devices", {
    data: payload,
  });
}
