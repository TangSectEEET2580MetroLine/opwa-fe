'use client';

import React from 'react';
import { useAuth } from '../app/AuthContext';
import { useRouter } from 'next/navigation';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <button onClick={handleLogout} style={{ marginTop: 16 }}>
      Logout
    </button>
  );
};

export default LogoutButton;
