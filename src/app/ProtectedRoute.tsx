'use client';

import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

type Props = {
  allowedRoles: Array<'ROLE_ADMIN' | 'ROLE_OPERATOR' | 'ROLE_TICKET_AGENT'>;
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<Props> = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log(user);
    if (!user) {
      router.push('/login');
    } else if (!user.roles.some(role => allowedRoles.includes(role as Props['allowedRoles'][number]))) {
      router.push('/unauthorized');
    }
  }, [user, allowedRoles, router]);

  if (!user || !user.roles.some(role => allowedRoles.includes(role as Props['allowedRoles'][number]))) return null;
  return <>{children}</>;
};

export default ProtectedRoute;