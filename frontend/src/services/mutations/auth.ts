import apiInstance from "../../lib/api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../../types/api";

export async function login(payload: LoginRequest) {
  const { data } = await apiInstance.post<AuthResponse>("/auth/login", payload);

  return data;
}

export async function register(payload: RegisterRequest) {
  const { data } = await apiInstance.post<AuthResponse>(
    "/auth/register",
    payload,
  );

  return data;
}
