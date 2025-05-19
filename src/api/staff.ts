import ApiClient from './utils/ApiClient';
import { ENDPOINTS } from '../config/endpoints';

export type StaffRequest = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nationalId: string;
  role: string;
  addressNumber: string;
  streetName: string;
  ward: string;
  district: string;
  city: string;
  phoneNumber: string;
  dateOfBirth: string;
  employed: boolean;
  shift: string;
};

export type StaffResponse = {
  createdAt: string;
  updatedAt: string;
  id: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nationalId: string;
  role: string;
  addressNumber: string;
  streetName: string;
  ward: string;
  district: string;
  city: string;
  fullAddress: string;
  phoneNumber: string;
  dateOfBirth: string;
  dateOfBirthFormatted: string;
  employed: boolean;
  shift: string;
};

export const registerStaff = async (data: StaffRequest, token?: string): Promise<StaffResponse> => {
  return await ApiClient.request<StaffResponse>({
    url: ENDPOINTS.staffRegister,
    method: 'POST',
    data,
  }, token);
};

export const getCurrentStaffProfile = async (token?: string): Promise<StaffResponse> => {
  return await ApiClient.request<StaffResponse>({
    url: ENDPOINTS.staffProfile,
    method: 'GET',
  }, token);
};

export const updateCurrentStaffProfile = async (data: Partial<StaffRequest>, token?: string): Promise<StaffResponse> => {
  return await ApiClient.request<StaffResponse>({
    url: ENDPOINTS.staffProfile,
    method: 'PUT',
    data,
  }, token);
};

export const getStaffById = async (id: string|number, token?: string): Promise<StaffResponse> => {
  return await ApiClient.request<StaffResponse>({
    url: ENDPOINTS.staffById(id),
    method: 'GET',
  }, token);
};

export const activateStaff = async (id: string|number, token?: string): Promise<StaffResponse> => {
  return await ApiClient.request<StaffResponse>({
    url: ENDPOINTS.staffActivate(id),
    method: 'PUT',
  }, token);
};

export const deactivateStaff = async (id: string|number, token?: string): Promise<StaffResponse> => {
  return await ApiClient.request<StaffResponse>({
    url: ENDPOINTS.staffDeactivate(id),
    method: 'PUT',
  }, token);
};

export type StaffPerformance = unknown; // Replace with actual fields if known

export const getPerformance = async (id: string|number, token?: string): Promise<StaffPerformance> => {
  return await ApiClient.request<StaffPerformance>({
    url: ENDPOINTS.staffPerformance(id),
    method: 'GET',
  }, token);
};

export const generateRegistrationLink = async (token?: string): Promise<{ link: string }> => {
  return await ApiClient.request<{ link: string }>({
    url: ENDPOINTS.staffGenerateLink,
    method: 'GET',
  }, token);
};