'use client';

import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '../AuthContext';
import LogoutButton from '../../components/LogoutButton';

export default function OperatorPage() {
  const { user } = useAuth();
  return (
    <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_OPERATOR']}>
      <div>
        <h1>Operator Dashboard</h1>
        <p>Welcome, {user?.email}!</p>
        <p>Your role: {user?.roles.join(', ')}</p>
        <LogoutButton />
      </div>
    </ProtectedRoute>
  );
}