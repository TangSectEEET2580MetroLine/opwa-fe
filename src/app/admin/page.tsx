'use client';

import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '../AuthContext';
import LogoutButton from '../../components/LogoutButton';

export default function AdminPage() {
  const { user } = useAuth();
  return (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_OPERATOR']}>
      <div className="card">
        <h1>Admin Dashboard</h1>
        <hr style={{ margin: '16px 0' }} />
        <p style={{ fontSize: 18, marginBottom: 8 }}>Welcome, <b>{user?.email}</b>!</p>
        <p style={{ color: '#555', marginBottom: 24 }}>Your role: <b>{user?.roles.join(', ')}</b></p>
        <LogoutButton />
      </div>
    </ProtectedRoute>
  );
}