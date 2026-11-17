import React from 'react';
import { Link } from 'react-router-dom';
import { HouseDoor, Search } from 'react-bootstrap-icons';

export const NotFound: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl shadow-sm p-8 sm:p-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 mb-4">
          <span className="text-2xl font-extrabold">!</span>
        </div>
        <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900">404</div>
        <h1 className="mt-3 text-xl sm:text-2xl font-bold text-slate-900">Page Not Found</h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-md mx-auto">
          The page you’re looking for doesn’t exist or may have been moved. Please check the URL or continue browsing our verified Chennai properties.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
          >
            <HouseDoor className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>
          <Link
            to="/properties"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <Search className="w-4 h-4 text-amber-600" />
            <span>Browse Properties</span>
          </Link>
        </div>
        <p className="mt-6 text-xs text-slate-500">
          RJ Land Ventures · Chennai Lands & Flats
        </p>
      </div>
    </div>
  );
};
