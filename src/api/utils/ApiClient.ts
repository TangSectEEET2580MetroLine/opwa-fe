import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiClient {
  static getHeaders(token?: string): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  static async request<T>(config: AxiosRequestConfig, token?: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios({
        ...config,
        headers: {
          ...ApiClient.getHeaders(token),
          ...config.headers,
        },
        withCredentials: false, // Set to true if using cookies
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data || error.message;
      }
      throw error;
    }
  }
}

export default ApiClient;