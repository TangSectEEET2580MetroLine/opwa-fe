import ApiClient from './utils/ApiClient';
import { ENDPOINTS } from '../config/endpoints';

export type StationRequest = {
  id: number;
  name: string;
  description: string;
  location: string;
  isActive: boolean;
};

export type StationResponse = StationRequest;

export type MetroLineRequest = {
  id: number;
  name: string;
  description: string;
  totalDurationMinutes: number;
  stations: StationRequest[];
  isActive: boolean;
  startStation: StationRequest;
  endStation: StationRequest;
};

export type MetroLineResponse = MetroLineRequest;

export type MetroLineSuspensionRequest = {
  metroLineId: number;
  metroLineName: string;
  suspensionType: string;
  reason: string;
  description: string;
  affectedStationIds: number[];
  affectedStationNames: string[];
  expectedRestorationTime: string;
  operatorId: number;
  cancelTrips: boolean;
};

export type MetroLineSuspensionResponse = {
  id: number;
  metroLineId: number;
  metroLineName: string;
  suspensionType: string;
  reason: string;
  description: string;
  affectedStationIds: string;
  affectedStationNames: string;
  operatorId: number;
  operatorName: string;
  expectedRestorationTime: string;
  startTime: string;
  endTime: string;
  notificationSuccessful: boolean;
  lastNotificationId: string;
  notificationAttempts: number;
  lastNotificationTime: string;
  acknowledgmentTime: string;
  active: boolean;
  affectedStationIdsList: number[];
  affectedStationNamesList: string[];
};

export type MetroLineSuspensionAcknowledgeRequest = {
  notificationId: string;
  status: string;
  errorMessage: string;
  timestamp: string;
  passengersNotified: boolean;
  passengersNotifiedCount: number;
  successful: boolean;
};

export type MetroLineSuspensionNotificationResponse = {
  notificationId: string;
  status: string;
  errorMessage: string;
  timestamp: string;
  passengersNotified: boolean;
  passengersNotifiedCount: number;
  successful: boolean;
};

// Station APIs
export const getAllStations = async (token?: string): Promise<StationResponse[]> => {
  return await ApiClient.request<StationResponse[]>({
    url: ENDPOINTS.metroStations,
    method: 'GET',
  }, token);
};

export const getStationById = async (id: string|number, token?: string): Promise<StationResponse> => {
  return await ApiClient.request<StationResponse>({
    url: ENDPOINTS.metroStationById(id),
    method: 'GET',
  }, token);
};

export const getActiveStations = async (token?: string): Promise<StationResponse[]> => {
  return await ApiClient.request<StationResponse[]>({
    url: ENDPOINTS.metroStationActive,
    method: 'GET',
  }, token);
};

export const createStation = async (data: StationRequest, token?: string): Promise<StationResponse> => {
  return await ApiClient.request<StationResponse>({
    url: ENDPOINTS.metroStationCreate,
    method: 'POST',
    data,
  }, token);
};

export const updateStation = async (id: string|number, data: Partial<StationRequest>, token?: string): Promise<StationResponse> => {
  return await ApiClient.request<StationResponse>({
    url: ENDPOINTS.metroStationUpdate(id),
    method: 'PUT',
    data,
  }, token);
};

export const deactivateStation = async (id: string|number, token?: string): Promise<StationResponse> => {
  return await ApiClient.request<StationResponse>({
    url: ENDPOINTS.metroStationDeactivate(id),
    method: 'PUT',
  }, token);
};

export const deleteStation = async (id: string|number, token?: string): Promise<void> => {
  await ApiClient.request<void>({
    url: ENDPOINTS.metroStationDelete(id),
    method: 'DELETE',
  }, token);
};

// Metro Line APIs
export const getAllMetroLines = async (token?: string): Promise<MetroLineResponse[]> => {
  return await ApiClient.request<MetroLineResponse[]>({
    url: ENDPOINTS.metroLinesAll,
    method: 'GET',
  }, token);
};

export const getMetroLineById = async (id: string|number, token?: string): Promise<MetroLineResponse> => {
  return await ApiClient.request<MetroLineResponse>({
    url: ENDPOINTS.metroLineById(id),
    method: 'GET',
  }, token);
};

export const getActiveMetroLines = async (token?: string): Promise<MetroLineResponse[]> => {
  return await ApiClient.request<MetroLineResponse[]>({
    url: ENDPOINTS.metroLineActive,
    method: 'GET',
  }, token);
};

export const createMetroLine = async (data: MetroLineRequest, token?: string): Promise<MetroLineResponse> => {
  return await ApiClient.request<MetroLineResponse>({
    url: ENDPOINTS.metroLineCreate,
    method: 'POST',
    data,
  }, token);
};

export const updateMetroLine = async (id: string|number, data: Partial<MetroLineRequest>, token?: string): Promise<MetroLineResponse> => {
  return await ApiClient.request<MetroLineResponse>({
    url: ENDPOINTS.metroLineUpdate(id),
    method: 'PUT',
    data,
  }, token);
};

export const deactivateMetroLine = async (id: string|number, token?: string): Promise<MetroLineResponse> => {
  return await ApiClient.request<MetroLineResponse>({
    url: ENDPOINTS.metroLineDeactivate(id),
    method: 'PUT',
  }, token);
};

export const deleteMetroLine = async (id: string|number, token?: string): Promise<void> => {
  await ApiClient.request<void>({
    url: ENDPOINTS.metroLineDelete(id),
    method: 'DELETE',
  }, token);
};

// Suspension APIs
export const getAllMetroSuspensions = async (token?: string): Promise<MetroLineSuspensionResponse[]> => {
  return await ApiClient.request<MetroLineSuspensionResponse[]>({
    url: ENDPOINTS.metroSuspensions,
    method: 'GET',
  }, token);
};

export const getMetroSuspensionById = async (suspensionId: string|number, token?: string): Promise<MetroLineSuspensionResponse> => {
  return await ApiClient.request<MetroLineSuspensionResponse>({
    url: ENDPOINTS.metroSuspensionById(suspensionId),
    method: 'GET',
  }, token);
};

export const getMetroSuspensionStationAffected = async (stationId: string|number, token?: string): Promise<boolean> => {
  return await ApiClient.request<boolean>({
    url: ENDPOINTS.metroSuspensionStationAffected(stationId),
    method: 'GET',
  }, token);
};

export const getMetroSuspensionByLine = async (metroLineId: string|number, token?: string): Promise<MetroLineSuspensionResponse[]> => {
  return await ApiClient.request<MetroLineSuspensionResponse[]>({
    url: ENDPOINTS.metroSuspensionByLine(metroLineId),
    method: 'GET',
  }, token);
};

export const getMetroSuspensionLineIsSuspended = async (metroLineId: string|number, token?: string): Promise<boolean> => {
  return await ApiClient.request<boolean>({
    url: ENDPOINTS.metroSuspensionLineIsSuspended(metroLineId),
    method: 'GET',
  }, token);
};

export const createMetroSuspension = async (data: MetroLineSuspensionRequest, token?: string): Promise<MetroLineSuspensionResponse> => {
  return await ApiClient.request<MetroLineSuspensionResponse>({
    url: ENDPOINTS.metroSuspensions,
    method: 'POST',
    data,
  }, token);
};

export const liftMetroSuspension = async (suspensionId: string|number, token?: string): Promise<MetroLineSuspensionResponse> => {
  return await ApiClient.request<MetroLineSuspensionResponse>({
    url: ENDPOINTS.metroSuspensionLift(suspensionId),
    method: 'PATCH',
  }, token);
};

export const retryMetroSuspensionNotification = async (suspensionId: string|number, token?: string): Promise<MetroLineSuspensionNotificationResponse> => {
  return await ApiClient.request<MetroLineSuspensionNotificationResponse>({
    url: ENDPOINTS.metroSuspensionRetryNotification(suspensionId),
    method: 'POST',
  }, token);
};

export const acknowledgeMetroSuspension = async (data: MetroLineSuspensionAcknowledgeRequest, token?: string): Promise<MetroLineSuspensionNotificationResponse> => {
  return await ApiClient.request<MetroLineSuspensionNotificationResponse>({
    url: ENDPOINTS.metroSuspensionAcknowledge,
    method: 'POST',
    data,
  }, token);
};

// Add more API functions as needed