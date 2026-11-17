import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GeoAlt, Telephone, Envelope, Youtube, Instagram, Facebook, ArrowUp } from 'react-bootstrap-icons';

interface FooterProps {
  onOpenPostProperty: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPostProperty }) => {
  const navigate = useNavigate();
  const goTop = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 pt-16 pb-12 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-4 shadow-sm sm:px-6 sm:py-5">
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
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              RJ Land Ventures is Chennai's premier real estate discovery platform specializing in verified CMDA and DTCP approved land parcels, coastal villa plots in ECR, and luxury flats across OMR and Greater Chennai.
            </p>
            <button
              type="button"
              onClick={goTop}
              className="hidden sm:inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold text-xs transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Top</span>
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/properties" className="hover:text-white transition-colors">All Properties</Link></li>
              <li><Link to="/flats" className="hover:text-white transition-colors">Flats & Apartments</Link></li>
              <li><Link to="/land" className="hover:text-white transition-colors">Residential Plots / Land</Link></li>
              <li><Link to="/our-services" className="hover:text-white transition-colors">Our Services</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Key Chennai Corridors</h4>
            <ul className="space-y-2">
              <li><Link to="/locations/omr-corridor" className="hover:text-white transition-colors">OMR IT Expressway Plots</Link></li>
              <li><Link to="/locations/ecr-coast" className="hover:text-white transition-colors">ECR Beachside Villa Lands</Link></li>
              <li><Link to="/locations/gst-suburbs" className="hover:text-white transition-colors">Guduvanchery & GST Plots</Link></li>
              <li><Link to="/locations/central-chennai" className="hover:text-white transition-colors">Anna Nagar Luxury Residences</Link></li>
              <li><Link to="/locations/west-chennai" className="hover:text-white transition-colors">Poonamallee Metro Townships</Link></li>
              <li><Link to="/locations/south-chennai" className="hover:text-white transition-colors">South Chennai (Velachery / Medavakkam)</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Chennai Advisory Desk</h4>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-start gap-2">
                <GeoAlt className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Express Chambers, Anna Salai, Thousand Lights, Chennai 600006</span>
              </div>
              <div className="flex items-center gap-2">
                <Telephone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-white">+91 6300 409 615</span>
              </div>
              <div className="flex items-center gap-2">
                <Envelope className="w-4 h-4 text-blue-400 shrink-0" />
                <span>chennai@rjlandventures.com</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button onClick={onOpenPostProperty} className="text-amber-400 hover:text-amber-300 font-semibold text-left">Sell Your Property</button>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube" className="p-2 rounded-lg bg-[#FF0000] text-white hover:opacity-90 transition-opacity"><Youtube className="w-4 h-4" /></a>
                <a href="https://www.instagram.com/rjlandventures?vrfl=MWt6dmQyNGJoOXhsaA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram" className="p-2 rounded-lg bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white hover:opacity-90 transition-opacity"><Instagram className="w-4 h-4" /></a>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook" className="p-2 rounded-lg bg-[#1877F2] text-white hover:opacity-90 transition-opacity"><Facebook className="w-4 h-4" /></a>
              </div>
              <button
                type="button"
                onClick={goTop}
                className="sm:hidden inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold text-xs transition-colors pt-1"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4" />
                <span>Top</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>© {new Date().getFullYear()} RJ Land Ventures. All rights reserved.</div>
          <div className="flex items-center gap-3">
            <Link to="/properties" className="hover:text-white">Properties</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
