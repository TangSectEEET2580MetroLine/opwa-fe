import ApiClient from './utils/ApiClient';
import { ENDPOINTS } from '../config/endpoints';

export type TicketCartItem = {
  itemId: string;
  tripId: number;
  tripInfo: string;
  metroLineName: string;
  departureTime: string;
  ticketType: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type TicketCart = {
  items: TicketCartItem[];
  staffId: number;
  passengerId: number;
  nationalId: string;
  email: string;
  phoneNumber: string;
  useWallet: boolean;
  lastUpdated: string;
  empty: boolean;
  itemCount: number;
  total: number;
  totalTicketCount: number;
};

export type TicketCartAddItem = {
  tripId: number;
  ticketType: string;
  quantity: number;
};

export type TicketCartPassenger = {
  passengerId?: number;
  nationalId?: string;
  email?: string;
  phoneNumber?: string;
  useWallet?: boolean;
};

export type TicketCartCheckout = {
  paymentMethod: 'CASH' | 'EWALLET';
  receivedAmount?: number;
};

export const fetchTicketCart = async (staffId: string|number): Promise<TicketCart> => {
  return await ApiClient.request<TicketCart>({
    url: ENDPOINTS.ticketCart(staffId),
    method: 'GET',
  });
};

export const addItemToCart = async (staffId: string|number, item: TicketCartAddItem): Promise<TicketCart> => {
  return await ApiClient.request<TicketCart>({
    url: ENDPOINTS.ticketCartAddItem(staffId),
    method: 'POST',
    data: item,
  });
};

export const updateCartItemQuantity = async (staffId: string|number, itemId: string|number, quantity: number): Promise<TicketCart> => {
  return await ApiClient.request<TicketCart>({
    url: ENDPOINTS.ticketCartItemQuantity(staffId, itemId),
    method: 'PATCH',
    data: { quantity },
  });
};

export const removeItemFromCart = async (staffId: string|number, itemId: string|number): Promise<TicketCart> => {
  return await ApiClient.request<TicketCart>({
    url: ENDPOINTS.ticketCartItem(staffId, itemId),
    method: 'DELETE',
  });
};

export const clearCart = async (staffId: string|number): Promise<TicketCart> => {
  return await ApiClient.request<TicketCart>({
    url: ENDPOINTS.ticketCartClear(staffId),
    method: 'DELETE',
  });
};

export const updateCartPassenger = async (staffId: string|number, passenger: TicketCartPassenger): Promise<TicketCart> => {
  return await ApiClient.request<TicketCart>({
    url: ENDPOINTS.ticketCartPassenger(staffId),
    method: 'PATCH',
    data: passenger,
  });
};

export const checkoutCart = async (staffId: string|number, payload: TicketCartCheckout): Promise<unknown> => {
  return await ApiClient.request<unknown>({
    url: ENDPOINTS.ticketCartCheckout(staffId),
    method: 'POST',
    data: payload,
  });
};