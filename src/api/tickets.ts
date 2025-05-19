import ApiClient from './utils/ApiClient';
import { ENDPOINTS } from '../config/endpoints';

export type TicketType = {
  id: string;
  name: string;
  price: number; // in VND
};

export const fetchTicketTypes = async (): Promise<TicketType[]> => {
  return await ApiClient.request<TicketType[]>({
    url: ENDPOINTS.ticketTypes,
    method: 'GET',
  });
};

export const purchaseTicket = async (data: {
  passengerType: 'guest' | 'registered';
  idValue: string;
  ticketTypeId: string;
  paymentMethod: 'cash' | 'ewallet';
  receivedAmount?: number;
}): Promise<any> => {
  return await ApiClient.request<any>({
    url: ENDPOINTS.ticketPurchase,
    method: 'POST',
    data,
  });
};

export type Ticket = {
  id: number;
  ticketNumber: string;
  ticketTypeId: number;
  ticketTypeName: string;
  price: number;
  metroLine: {
    id: number;
    name: string;
    startStationName: string;
    endStationName: string;
    totalDurationMinutes: number;
    isActive: boolean;
  };
  passengerId: number;
  nationalId: string;
  paymentMethod: 'CASH' | 'EWALLET';
  amountPaid: number;
  changeAmount: number;
  purchaseDate: string;
  validFrom: string;
  validUntil: string;
  soldByStaffName: string;
};