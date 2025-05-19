import ApiClient from './utils/ApiClient';
import { ENDPOINTS } from '../config/endpoints';

export type AuthResponse = {
  email: string;
  roles: string[];
  token: string;
  type: string;
  expiresIn: number;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  return await ApiClient.request<AuthResponse>({
    url: ENDPOINTS.login,
    method: 'POST',
    data: { email, password },
  });
};