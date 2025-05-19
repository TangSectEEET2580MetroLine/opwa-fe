import ProtectedRoute from '../ProtectedRoute';

export default function PassengerPurchaseHistoryPage() {
  return (
    <ProtectedRoute allowedRoles={['ROLE_TICKET_AGENT']}>
      <div className="card">
        <h1>Passenger Purchase History</h1>
        <hr style={{ margin: '16px 0' }} />
        <p>Passenger purchase history functionality coming soon.</p>
      </div>
    </ProtectedRoute>
  );
}