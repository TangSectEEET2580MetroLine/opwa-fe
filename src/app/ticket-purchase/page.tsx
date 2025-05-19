"use client";

import React, { useEffect, useState } from "react";
import { fetchTicketTypes, purchaseTicket, TicketType } from "../../api/tickets";
import ProtectedRoute from "../ProtectedRoute";

const TicketPurchasePage = () => {
  const [passengerType, setPassengerType] = useState<'guest' | 'registered'>('guest');
  const [idValue, setIdValue] = useState('');
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [ticketTypeId, setTicketTypeId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'ewallet'>('cash');
  const [receivedAmount, setReceivedAmount] = useState<number | ''>('');
  const [change, setChange] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    fetchTicketTypes().then(types => {
      setTicketTypes(types);
      if (types.length > 0) setTicketTypeId(types[0].id);
    });
  }, []);

  const selectedTicket = ticketTypes.find(t => t.id === ticketTypeId);
  const ticketPrice = selectedTicket?.price || 0;

  useEffect(() => {
    if (paymentMethod === 'cash' && receivedAmount !== '' && ticketPrice) {
      setChange(Math.max(0, Number(receivedAmount) - ticketPrice));
    } else {
      setChange(0);
    }
  }, [paymentMethod, receivedAmount, ticketPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!idValue.trim()) {
      setError('Please enter a valid ID.');
      return;
    }
    if (!ticketTypeId) {
      setError('Please select a ticket type.');
      return;
    }
    if (paymentMethod === 'cash') {
      if (receivedAmount === '' || Number(receivedAmount) < ticketPrice) {
        setError('Received amount must be at least the ticket price.');
        return;
      }
    }
    setShowSummary(true);
  };

  const handleConfirmPurchase = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await purchaseTicket({
        passengerType,
        idValue,
        ticketTypeId,
        paymentMethod,
        receivedAmount: paymentMethod === 'cash' ? Number(receivedAmount) : undefined,
      });
      if (result && result.success) {
        setSuccess(result.message || 'Ticket purchased successfully!');
        setIdValue('');
        setReceivedAmount('');
        setChange(0);
        setShowSummary(false);
      } else {
        setError(result?.message || 'Failed to purchase ticket.');
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'message' in err) {
        setError((err as { message?: string }).message || 'Failed to purchase ticket.');
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('Failed to purchase ticket.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['TICKET_AGENT']}>
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="card bg-base-100 shadow-xl w-full max-w-md p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Purchase Ticket</h1>
          <form onSubmit={handleSubmit} aria-label="Purchase Ticket Form" className="space-y-4">
            <div>
              <div className="font-semibold mb-1">Passenger Type</div>
              <div className="flex gap-4">
                <label className="label cursor-pointer gap-2">
                  <input type="radio" name="ptype" className="radio radio-primary" checked={passengerType === 'guest'} onChange={() => setPassengerType('guest')} />
                  <span className="label-text">Guest</span>
                </label>
                <label className="label cursor-pointer gap-2">
                  <input type="radio" name="ptype" className="radio radio-primary" checked={passengerType === 'registered'} onChange={() => setPassengerType('registered')} />
                  <span className="label-text">Registered</span>
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="idValue" className="label font-semibold">{passengerType === 'guest' ? 'National ID' : 'Passenger ID'}</label>
              <input
                id="idValue"
                type="text"
                placeholder={passengerType === 'guest' ? 'National ID' : 'Passenger ID'}
                value={idValue}
                onChange={e => setIdValue(e.target.value)}
                required
                aria-required="true"
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label htmlFor="ticketType" className="label font-semibold">Ticket Type</label>
              <select
                id="ticketType"
                value={ticketTypeId}
                onChange={e => setTicketTypeId(e.target.value)}
                className="select select-bordered w-full"
              >
                {ticketTypes.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.price.toLocaleString()} VND)</option>
                ))}
              </select>
              {selectedTicket && (
                <div className="text-sm text-gray-500 mt-1">Price: {selectedTicket.price.toLocaleString()} VND</div>
              )}
            </div>
            <div>
              <div className="font-semibold mb-1">Payment Method</div>
              <div className="flex gap-4">
                <label className="label cursor-pointer gap-2">
                  <input type="radio" name="paymethod" className="radio radio-primary" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                  <span className="label-text">Cash</span>
                </label>
                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    name="paymethod"
                    className="radio radio-primary"
                    checked={paymentMethod === 'ewallet'}
                    onChange={() => setPaymentMethod('ewallet')}
                    disabled={passengerType === 'guest'}
                    aria-disabled={passengerType === 'guest'}
                  />
                  <span className="label-text">e-Wallet</span>
                </label>
              </div>
              {passengerType === 'guest' && (
                <div className="text-xs text-gray-400 mt-1">e-Wallet is only available for registered passengers.</div>
              )}
            </div>
            {paymentMethod === 'cash' && (
              <div>
                <label htmlFor="receivedAmount" className="label font-semibold">Received Amount (VND)</label>
                <input
                  id="receivedAmount"
                  type="number"
                  min={ticketPrice}
                  placeholder="Received amount (VND)"
                  value={receivedAmount}
                  onChange={e => setReceivedAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                  aria-required="true"
                  className="input input-bordered w-full"
                />
                <div className={`mt-1 text-sm ${change < 0 ? 'text-error' : 'text-gray-700'}`}>
                  Change: {change.toLocaleString()} VND
                </div>
              </div>
            )}
            <div className="font-semibold text-base-content/80">Ticket Price: {ticketPrice.toLocaleString()} VND</div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
              {loading ? 'Processing...' : 'Purchase'}
            </button>
            {error && <div className="alert alert-error mt-2 py-2 text-white">{error}</div>}
            {success && <div className="alert alert-success mt-2 py-2 text-white">{success}</div>}
          </form>
        </div>
        {/* Purchase summary modal/dialog */}
        {showSummary && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="modal-box max-w-md w-full">
              <h2 className="font-bold text-lg mb-2">Confirm Purchase</h2>
              <ul className="list-none p-0 m-0 text-base space-y-1">
                <li><b>Passenger Type:</b> {passengerType === 'guest' ? 'Guest' : 'Registered'}</li>
                <li><b>{passengerType === 'guest' ? 'National ID' : 'Passenger ID'}:</b> {idValue}</li>
                <li><b>Ticket Type:</b> {selectedTicket?.name}</li>
                <li><b>Price:</b> {ticketPrice.toLocaleString()} VND</li>
                <li><b>Payment Method:</b> {paymentMethod === 'cash' ? 'Cash' : 'e-Wallet'}</li>
                {paymentMethod === 'cash' && (
                  <>
                    <li><b>Received:</b> {receivedAmount?.toLocaleString()} VND</li>
                    <li><b>Change:</b> {change.toLocaleString()} VND</li>
                  </>
                )}
              </ul>
              <div className="modal-action mt-6 flex gap-2">
                <button className="btn btn-outline" onClick={() => setShowSummary(false)} disabled={loading}>Cancel</button>
                <button className="btn btn-primary" onClick={handleConfirmPurchase} disabled={loading}>{loading ? 'Processing...' : 'Confirm'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default TicketPurchasePage;