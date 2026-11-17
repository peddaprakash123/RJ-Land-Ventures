import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Heart, HeartFill, Lock, List, PlusLg, XLg } from 'react-bootstrap-icons';

interface NavbarProps {
  onOpenPostProperty: () => void;
  onOpenSavedDrawer: () => void;
  onOpenAdminLogin: () => void;
  savedCount: number;
}

const NAV_LINKS = [
  { href: '/properties', label: 'Explore Properties' },
  { href: '/flats', label: 'Flats' },
  { href: '/land', label: 'Land' },
  { href: '/our-services', label: 'Our Services' },
  { href: '/how-it-works', label: 'How It Works' },
] as const;

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPostProperty,
  onOpenSavedDrawer,
  onOpenAdminLogin,
  savedCount,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (target && !headerRef.current?.contains(target)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handleOutsidePointerDown);
    };
  }, [isMenuOpen]);

  const handleAdminLogin = () => {
    setIsMenuOpen(false);
    onOpenAdminLogin();
  };

  const handlePostProperty = () => {
    setIsMenuOpen(false);
    onOpenPostProperty();
  };

  const handleSavedDrawer = () => {
    setIsMenuOpen(false);
    onOpenSavedDrawer();
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6 sm:py-3.5">
        <Link
          to="/"
          onClick={() => setIsMenuOpen(false)}
          aria-label="RJ Land Ventures home"
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap sm:gap-2.5"
        >
          <img
            src="/images/rj-land-ventures-mark.png?v=4"
            alt="RJ Land Ventures logo"
            width={354}
            height={301}
            className="h-9 w-auto shrink-0 sm:h-11"
          />
          <span className="flex flex-col leading-none">
            <span className="text-[12px] font-extrabold tracking-[0.05em] text-[#006837] sm:text-[15px] sm:tracking-[0.08em]">
              LAND VENTURES
            </span>
            <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.1em] text-slate-500 sm:text-[9px] sm:tracking-[0.18em]">
              Chennai Lands &amp; Flats
            </span>
          </span>
        </Link>

        <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-slate-600">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={handleAdminLogin}
            className="hidden xl:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 whitespace-nowrap"
            title="Admin login"
            aria-label="Admin login"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Login</span>
          </button>

          <button
            onClick={handleSavedDrawer}
            className="relative p-2 sm:p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            title="View saved properties"
            aria-label="View saved properties"
          >
            {savedCount > 0 ? (
              <HeartFill className="w-4 h-4 text-rose-500" />
            ) : (
              <Heart className="w-4 h-4" />
            )}
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={handlePostProperty}
            title="Post Property"
            aria-label="Post Property"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-2.5 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all whitespace-nowrap shrink-0 shadow-sm"
          >
            <PlusLg className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Post Property</span>
          </button>

          <button
            onClick={() => setIsMenuOpen((open) => !open)}
            className="xl:hidden p-2 sm:p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            title={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            {isMenuOpen ? <XLg className="w-4 h-4" /> : <List className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="xl:hidden border-t border-slate-200 bg-white px-4 sm:px-6 py-3 shadow-lg"
        >
          <nav className="max-w-7xl mx-auto flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between gap-3 px-2 py-3 text-sm font-semibold text-slate-700 border-b border-slate-100 hover:text-slate-950 transition-colors"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}

            <button
              onClick={() => { setIsMenuOpen(false); navigate('/admin'); }}
              className="mt-3 flex w-full items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-950 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Admin Login</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
