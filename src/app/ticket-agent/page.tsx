'use client';

import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '../AuthContext';
import LogoutButton from '../../components/LogoutButton';
import React, { useEffect, useState } from 'react';
import {
  fetchTicketCart, TicketCart, addItemToCart, TicketCartItem, checkoutCart, TicketCartCheckout
} from '../../api/ticketCart';

const initialItem: Omit<TicketCartItem, 'subtotal'> = {
  itemId: '',
  tripId: 0,
  tripInfo: '',
  metroLineName: '',
  departureTime: '',
  ticketType: '',
  quantity: 1,
  unitPrice: 0,
};

export default function TicketAgentPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState<TicketCart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState(initialItem);
  const [itemLoading, setItemLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'EWALLET'>('CASH');
  const [cashReceived, setCashReceived] = useState<number | ''>('');

  const staffId = user?.email;

  const refreshCart = () => {
    if (!staffId) return;
    setLoading(true);
    fetchTicketCart(staffId)
      .then(setCart)
      .catch(e => setError(typeof e === 'string' ? e : (e?.message || 'Failed to load cart')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshCart();
    // eslint-disable-next-line
  }, [staffId]);

  const handleItemFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItemForm(f => ({ ...f, [name]: name === 'quantity' || name === 'unitPrice' || name === 'tripId' ? Number(value) : value }));
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setItemLoading(true);
    setSuccess(null);
    setError(null);
    try {
      await addItemToCart(staffId!, itemForm);
      setSuccess('Item added to cart!');
      setItemForm(initialItem);
      refreshCart();
    } catch (err: unknown) {
      setError(typeof err === 'object' && err && 'message' in err ? (err as { message?: string }).message || 'Failed to add item' : 'Failed to add item');
    } finally {
      setItemLoading(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutLoading(true);
    setCheckoutError(null);
    setCheckoutSuccess(null);
    try {
      const payload: TicketCartCheckout = {
        paymentMethod,
        ...(paymentMethod === 'CASH' && cashReceived !== '' ? { receivedAmount: Number(cashReceived) } : {}),
      };
      await checkoutCart(staffId!, payload);
      setCheckoutSuccess('Payment processed successfully!');
      refreshCart();
    } catch (err: unknown) {
      setCheckoutError(typeof err === 'object' && err && 'message' in err ? (err as { message?: string }).message || 'Checkout failed' : 'Checkout failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['ROLE_TICKET_AGENT']}>
      <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto p-6 mt-8">
        <h1 className="text-2xl font-bold mb-2">Ticket Agent Dashboard</h1>
        <hr className="my-4" />
        <p className="mb-2">Welcome, <b>{user?.email}</b>!</p>
        <p className="mb-4 text-gray-500">Your role: <b>{user?.roles.join(', ')}</b></p>
        <LogoutButton />
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Add Item to Cart</h2>
          <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <input name="itemId" value={itemForm.itemId} onChange={handleItemFormChange} placeholder="Item ID" className="input input-bordered w-full" required />
            <input name="tripId" value={itemForm.tripId} onChange={handleItemFormChange} placeholder="Trip ID" type="number" className="input input-bordered w-full" required />
            <input name="tripInfo" value={itemForm.tripInfo} onChange={handleItemFormChange} placeholder="Trip Info" className="input input-bordered w-full" required />
            <input name="metroLineName" value={itemForm.metroLineName} onChange={handleItemFormChange} placeholder="Metro Line Name" className="input input-bordered w-full" required />
            <input name="departureTime" value={itemForm.departureTime} onChange={handleItemFormChange} placeholder="Departure Time" className="input input-bordered w-full" required />
            <input name="ticketType" value={itemForm.ticketType} onChange={handleItemFormChange} placeholder="Ticket Type" className="input input-bordered w-full" required />
            <input name="quantity" value={itemForm.quantity} onChange={handleItemFormChange} placeholder="Quantity" type="number" min={1} className="input input-bordered w-full" required />
            <input name="unitPrice" value={itemForm.unitPrice} onChange={handleItemFormChange} placeholder="Unit Price" type="number" min={0} className="input input-bordered w-full" required />
            <button type="submit" className="btn btn-primary col-span-1 sm:col-span-2" disabled={itemLoading}>{itemLoading ? 'Adding...' : 'Add to Cart'}</button>
          </form>
          {success && <div className="alert alert-success mb-4 text-white">{success}</div>}
          {error && <div className="alert alert-error mb-4 text-white">{error}</div>}
          <h2 className="text-xl font-semibold mb-4">Your Ticket Cart</h2>
          {loading && <div className="alert alert-info">Loading cart...</div>}
          {!loading && !error && cart && (
            <>
              {cart.empty ? (
                <div className="alert alert-warning">Your cart is empty.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table w-full mb-4">
                    <thead>
                      <tr>
                        <th>Trip</th>
                        <th>Metro Line</th>
                        <th>Departure</th>
                        <th>Type</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.items.map(item => (
                        <tr key={item.itemId}>
                          <td>{item.tripInfo}</td>
                          <td>{item.metroLineName}</td>
                          <td>{item.departureTime}</td>
                          <td>{item.ticketType}</td>
                          <td>{item.quantity}</td>
                          <td>{item.unitPrice.toLocaleString()} VND</td>
                          <td>{item.subtotal.toLocaleString()} VND</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <div>
                      <div className="font-semibold">Total Items: <span className="text-primary">{cart.itemCount}</span></div>
                      <div className="font-semibold">Total Tickets: <span className="text-primary">{cart.totalTicketCount}</span></div>
                    </div>
                    <div className="text-lg font-bold">Total: <span className="text-success">{cart.total.toLocaleString()} VND</span></div>
                  </div>
                  <form onSubmit={handleCheckout} className="mt-6 flex flex-col sm:flex-row gap-4 items-end">
                    <div>
                      <label className="label">Payment Method</label>
                      <select className="select select-bordered w-full" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as 'CASH' | 'EWALLET')}>
                        <option value="CASH">Cash</option>
                        <option value="EWALLET">e-Wallet</option>
                      </select>
                    </div>
                    {paymentMethod === 'CASH' && (
                      <div>
                        <label className="label">Cash Received</label>
                        <input type="number" className="input input-bordered w-full" value={cashReceived} onChange={e => setCashReceived(e.target.value === '' ? '' : Number(e.target.value))} min={cart.total} placeholder="Cash Received" required />
                      </div>
                    )}
                    <button type="submit" className="btn btn-success" disabled={checkoutLoading}>{checkoutLoading ? 'Processing...' : 'Checkout'}</button>
                  </form>
                  {checkoutError && <div className="alert alert-error mt-2 text-white">{checkoutError}</div>}
                  {checkoutSuccess && <div className="alert alert-success mt-2 text-white">{checkoutSuccess}</div>}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}