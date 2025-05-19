'use client';

import Link from 'next/link';
import { useAuth } from '../app/AuthContext';
import { useRouter } from 'next/navigation';

const links = [
  { href: '/admin', title: 'Admin Dashboard', icon: '🛠️' },
  { href: '/operator', title: 'Operator Dashboard', icon: '🚦' },
  { href: '/ticket-agent', title: 'Ticket Agent Dashboard', icon: '🎫' },
  { href: '/staff-profile', title: 'Staff Profile', icon: '👤' },
  { href: '/ticket-purchase', title: 'Ticket Purchase', icon: '💳' },
  { href: '/passenger-purchase-history', title: 'Passenger Purchase History', icon: '🧾' },
  { href: '/metro-lines', title: 'Metro Lines', icon: '🚇' },
];

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center bg-base-200 px-2">
      <h1 className="text-3xl font-bold text-center mb-8">OPWA Metro Operator System</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {!user ? (
          <Link
            href="/login"
            className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col items-center p-6 cursor-pointer border border-transparent hover:border-primary group"
          >
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🔑</div>
            <h2 className="text-xl font-semibold text-center group-hover:text-primary transition-colors">Login</h2>
          </Link>
        ) : (
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col items-center p-6 cursor-pointer border border-transparent hover:border-primary group"
          >
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🚪</div>
            <h2 className="text-xl font-semibold text-center group-hover:text-primary transition-colors">Logout</h2>
          </button>
        )}
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col items-center p-6 cursor-pointer border border-transparent hover:border-primary group"
          >
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{link.icon}</div>
            <h2 className="text-xl font-semibold text-center group-hover:text-primary transition-colors">{link.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
