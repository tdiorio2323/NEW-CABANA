/**
 * Main App Layout
 * Includes navigation, sidebar, and content area
 */

import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../lib/store/authStore';
import { Button } from '../../../components/ui/Button';

export const AppLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/feed', label: 'Feed', icon: '🏠', roles: ['creator', 'fan', 'admin'] },
    { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['creator'] },
    { path: '/posts', label: 'My Posts', icon: '📝', roles: ['creator'] },
    { path: '/messages', label: 'Messages', icon: '💬', roles: ['creator', 'fan'] },
    { path: '/profile', label: 'Profile', icon: '👤', roles: ['creator', 'fan', 'admin'] },
  ];

  const filteredNavItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  if (!isAuthenticated || !user) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/feed" className="flex items-center gap-2">
              <div className="holographic-logo text-2xl font-bold">CABANA</div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {filteredNavItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[var(--brand-gold)]/10 text-[var(--brand-gold)]'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {/* User Avatar */}
              <Link to="/profile" className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full border-2 border-[var(--brand-gold)]"
                />
                <div className="hidden lg:block">
                  <p className="text-sm font-medium">{user.displayName}</p>
                  <p className="text-xs text-gray-400">@{user.username}</p>
                </div>
              </Link>

              {/* Logout */}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-800">
          <div className="flex items-center justify-around py-2">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${
                    isActive ? 'text-[var(--brand-gold)]' : 'text-gray-400'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 md:pt-20 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
