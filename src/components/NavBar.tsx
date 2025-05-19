'use client';

import Link from 'next/link';
import { useAuth } from '../app/AuthContext';
import LogoutButton from './LogoutButton';

const NavBar = () => {
  const { user } = useAuth();

  return (
    <div className="navbar bg-base-100 rounded-box">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost normal-case text-lg">Home</Link>
      </div>
      <div className="navbar-center gap-2">
        {!user && <Link href="/login" className="btn btn-outline btn-sm">Login</Link>}
        {user && (user.role === 'ADMIN' || user.role === 'OPERATOR') && (
          <Link href="/admin" className="btn btn-ghost btn-sm">Admin Dashboard</Link>
        )}
        {user && (user.role === 'ADMIN' || user.role === 'OPERATOR') && (
          <Link href="/operator" className="btn btn-ghost btn-sm">Operator Dashboard</Link>
        )}
        {user && user.role === 'TICKET_AGENT' && (
          <Link href="/ticket-agent" className="btn btn-ghost btn-sm">Ticket Agent Dashboard</Link>
        )}
        {user && <Link href="/staff-profile" className="btn btn-ghost btn-sm">Staff Profile</Link>}
        {user && user.role === 'TICKET_AGENT' && (
          <Link href="/ticket-purchase" className="btn btn-ghost btn-sm">Ticket Purchase</Link>
        )}
        {user && user.role === 'TICKET_AGENT' && (
          <Link href="/passenger-purchase-history" className="btn btn-ghost btn-sm">Passenger Purchase History</Link>
        )}
        {user && <Link href="/metro-lines" className="btn btn-ghost btn-sm">Metro Lines</Link>}
      </div>
      <div className="navbar-end gap-2">
        {user && (
          <span className="text-sm text-gray-500 mr-2">
            Logged in as <span className="font-semibold">{user.email}</span> (<span className="uppercase">{user.role}</span>)
          </span>
        )}
        {user && <LogoutButton />}
      </div>
    </div>
  );
};

export default NavBar;