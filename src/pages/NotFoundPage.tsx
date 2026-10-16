import React from 'react';
import { Link } from 'react-router-dom';
import { Home, QrCode } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
          <QrCode className="w-8 h-8" />
        </div>
        <span className="text-4xl font-extrabold text-slate-900 dark:text-white block font-mono">
          404
        </span>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Page Not Found
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          The page you are looking for doesn't exist or has moved. Return to QR Studio to continue generating high-resolution codes.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
