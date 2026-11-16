import React, { useEffect, useState } from 'react';
import {
  XLg,
  Lock,
  Eye,
  EyeSlash,
  ShieldCheck,
  ExclamationCircle,
} from 'react-bootstrap-icons';
import { ADMIN_PASSWORD } from '../auth/adminAuth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Reset the form every time the modal is opened.
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setShowPassword(false);
      setError('');
    }
  }, [isOpen]);

  // Close on Escape key.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== ADMIN_PASSWORD) {
      setError('Incorrect admin password. Access denied.');
      return;
    }

    onLoginSuccess();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain no-scrollbar bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Admin login"
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-slate-900 px-6 py-6 text-white">
          <button
            onClick={onClose}
            aria-label="Close admin login"
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <XLg className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">Admin Login</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Restricted access · RJ Land Ventures
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="admin-password"
              className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoFocus
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter admin password"
                className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-slate-50 focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2.5 top-2.5 p-0.5 text-slate-400 hover:text-slate-700 transition-colors"
              >
                {showPassword ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
              <ExclamationCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!password}
            className="w-full py-3 px-4 text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Sign In as Admin</span>
          </button>

          <p className="text-[10px] text-center text-slate-400 leading-relaxed">
            This area is reserved for authorised administrators only.
            <br />
            Do not share the admin password with anyone.
          </p>
        </form>
      </div>
    </div>
  );
};

