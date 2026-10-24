import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { QrCode, Sun, Moon, Menu, X, Sparkles } from 'lucide-react';
import { useTheme } from '../../lib/theme/ThemeContext';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'QR Generator', path: '/generator' },
    { label: 'Template Library', path: '/templates' },
    { label: 'History', path: '/history' },
    { label: 'Print Templates', path: '/generator?mode=print-templates' },
    { label: 'Tabletop Cards', path: '/generator?mode=promo-card' },
    { label: 'Design Services', path: '/#services' },
    { label: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/history') {
      return location.pathname === '/history';
    }
    if (path === '/templates') {
      return location.pathname === '/templates';
    }
    if (path.includes('?mode=print-templates')) {
      return location.pathname === '/generator' && location.search.includes('mode=print-templates');
    }
    if (path.includes('?mode=promo-card')) {
      return location.pathname === '/generator' && location.search.includes('mode=promo-card');
    }
    if (path === '/generator') {
      return (
        location.pathname === '/generator' &&
        !location.search.includes('mode=promo-card') &&
        !location.search.includes('mode=print-templates')
      );
    }
    if (path === '/') return location.pathname === '/' && !location.hash;
    if (path.startsWith('/#')) return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-slate-900 dark:text-white font-semibold text-lg tracking-tight group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <span>QR Studio</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              to="/generator"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create QR</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive(item.path)
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              to="/generator"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium"
            >
              <Sparkles className="w-4 h-4" />
              <span>Open QR Generator</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
