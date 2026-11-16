import React from 'react';
import { GeoAlt, Telephone, Envelope } from 'react-bootstrap-icons';

interface FooterProps {
  onOpenLegalGuide: () => void;
  onOpenPostProperty: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegalGuide, onOpenPostProperty }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-4 shadow-sm sm:px-6 sm:py-5">
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
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              RJ Land Ventures is Chennai's premier real estate discovery platform specializing in verified CMDA and DTCP approved land parcels, coastal villa plots in ECR, and luxury flats across OMR and Greater Chennai.
            </p>
          </div>

          {/* Quick Chennai Corridors */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Key Chennai Corridors
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#properties" className="hover:text-white transition-colors">
                  OMR IT Expressway Plots
                </a>
              </li>
              <li>
                <a href="#properties" className="hover:text-white transition-colors">
                  ECR Beachside Villa Lands
                </a>
              </li>
              <li>
                <a href="#properties" className="hover:text-white transition-colors">
                  Guduvanchery & GST Plots
                </a>
              </li>
              <li>
                <a href="#properties" className="hover:text-white transition-colors">
                  Anna Nagar Luxury Residences
                </a>
              </li>
              <li>
                <a href="#properties" className="hover:text-white transition-colors">
                  Poonamallee Metro Townships
                </a>
              </li>
            </ul>
          </div>

          {/* Tools & Legal */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Tools & Due Diligence
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#properties" className="hover:text-white transition-colors">
                  Browse All Chennai Listings
                </a>
              </li>
              <li>
                <a href="#virtual-tour" className="hover:text-white transition-colors">
                  Take Virtual Tours
                </a>
              </li>
              <li>
                <button onClick={onOpenLegalGuide} className="hover:text-white transition-colors text-left">
                  Computerized Patta Verification
                </button>
              </li>
              <li>
                <button onClick={onOpenLegalGuide} className="hover:text-white transition-colors text-left">
                  30-Year EC Search on TNREGINET
                </button>
              </li>
              <li>
                <button onClick={onOpenPostProperty} className="text-amber-400 hover:text-amber-300 font-semibold text-left">
                  Sell Your Chennai Property
                </button>
              </li>
            </ul>
          </div>

          {/* Chennai Desk & Direct Assistance */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Chennai Advisory Desk
            </h4>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-start gap-2">
                <GeoAlt className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Express Chambers, Anna Salai, Thousand Lights, Chennai 600006</span>
              </div>
              <div className="flex items-center gap-2">
                <Telephone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-white">+91 44 2855 0100 · WhatsApp +91 63004 09615</span>
              </div>
              <div className="flex items-center gap-2">
                <Envelope className="w-4 h-4 text-blue-400 shrink-0" />
                <span>chennai@singararealties.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} RJ Land Ventures. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
