import React, { useState } from 'react';
import { XLg, CheckCircle, FileEarmarkCheck, BoxArrowUpRight } from 'react-bootstrap-icons';

interface LegalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalGuideModal: React.FC<LegalGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'patta' | 'cmda' | 'ec' | 'uds' | 'flood'>('patta');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain no-scrollbar bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <FileEarmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Chennai Buyerâ€™s Legal & Due Diligence Guide</h3>
              <p className="text-xs text-slate-300">
                Official Tamil Nadu Government verification protocols for land plots and apartments
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close legal guide modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <XLg className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto no-scrollbar text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('patta')}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'patta'
                ? 'border-amber-600 text-amber-700 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            1. Patta & Chitta Check
          </button>
          <button
            onClick={() => setActiveTab('cmda')}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'cmda'
                ? 'border-amber-600 text-amber-700 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            2. CMDA vs DTCP Sanction
          </button>
          <button
            onClick={() => setActiveTab('ec')}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'ec'
                ? 'border-amber-600 text-amber-700 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            3. 30-Year EC on TNREGINET
          </button>
          <button
            onClick={() => setActiveTab('uds')}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'uds'
                ? 'border-amber-600 text-amber-700 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            4. UDS (Undivided Share) Formula
          </button>
          <button
            onClick={() => setActiveTab('flood')}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'flood'
                ? 'border-amber-600 text-amber-700 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            5. Water & Flood Micro-Zoning
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto overscroll-contain no-scrollbar space-y-6 text-sm text-slate-700">
          {activeTab === 'patta' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <h4 className="font-bold text-amber-900 mb-1">
                  What is a Patta and why is it vital in Chennai?
                </h4>
                <p className="text-slate-700 text-xs leading-relaxed">
                  A Patta is a legal document issued by the Tamil Nadu Revenue Department certifying that the specified person is the registered owner of the property. For lands in Chennai (and expanded CMA taluks), having an <strong>Individual Computerized Patta</strong> is non-negotiable for obtaining building plan sanctions and bank home loans.
                </p>
              </div>

              <h5 className="font-semibold text-slate-900">Step-by-Step Online Verification:</h5>
              <ol className="list-decimal pl-5 space-y-2 text-xs leading-relaxed text-slate-600">
                <li>Visit the Tamil Nadu Revenue portal: <strong>eservices.tn.gov.in</strong></li>
                <li>Select "View Patta & FMB / Chitta / TSLR Extract".</li>
                <li>Choose District (e.g., Chennai, Chengalpattu, Kanchipuram, Tiruvallur) and your specific Taluk & Village.</li>
                <li>Enter the <strong>Survey Number</strong> and <strong>Sub-Division Number</strong> printed on the sale deed.</li>
                <li>Verify that the seller's name exactly matches the name recorded in the government revenue server.</li>
              </ol>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between">
                <span>Direct link to Tamil Nadu e-Services Portal</span>
                <a
                  href="https://eservices.tn.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                >
                  eservices.tn.gov.in <BoxArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {activeTab === 'cmda' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-1">
                  CMDA (Chennai Metropolitan Area) vs DTCP
                </h4>
                <p className="text-slate-700 text-xs leading-relaxed">
                  The Chennai Metropolitan Development Authority (CMDA) governs planning within the official CMA boundary (expanded to 5,904 sq.km including parts of Chengalpattu, Kanchipuram, and Tiruvallur). Directorate of Town and Country Planning (DTCP) governs layout approvals outside the CMDA jurisdiction.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-slate-900">CMDA Approved Layouts</div>
                  <ul className="space-y-1.5 text-slate-600">
                    <li>â€¢ Required inside Greater Chennai Corporation and expanding CMA radius.</li>
                    <li>â€¢ Mandates minimum 30-ft internal roads and 10% Open Space Reservation (OSR) handed over to local body.</li>
                    <li>â€¢ Recognized by all nationalized banks (SBI, Canara, Indian Bank) for instant construction loans.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-slate-900">DTCP Approved Layouts</div>
                  <ul className="space-y-1.5 text-slate-600">
                    <li>â€¢ Standard for fast-growing peripheral towns along GST, Bangalore Highway & ECR.</li>
                    <li>â€¢ Never buy unapproved or "panchayat approved" agricultural lands without DTCP conversion.</li>
                    <li>â€¢ Both CMDA and DTCP projects must have mandatory <strong>TNRERA Registration</strong>.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ec' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <h4 className="font-bold text-emerald-900 mb-1">
                  Encumbrance Certificate (EC) on TNREGINET
                </h4>
                <p className="text-slate-700 text-xs leading-relaxed">
                  An Encumbrance Certificate proves whether a property has any registered financial or legal liabilities (unpaid bank mortgages, court attachments, or conflicting sale agreements). Always search for a minimum of <strong>30 to 33 years</strong>.
                </p>
              </div>

              <h5 className="font-semibold text-slate-900">How to inspect on TNREGINET:</h5>
              <div className="space-y-2 text-xs text-slate-600">
                <p>1. Access <strong>tnreginet.gov.in</strong> (Tamil Nadu Inspector General of Registration).</p>
                <p>2. Select "E-Services" â†’ "Encumbrance Certificate" â†’ "View EC".</p>
                <p>3. Input Zone, District, Sub-Registrar Office (SRO) jurisdiction, and Village.</p>
                <p>4. Input Survey Number and specify the start year (e.g. 1993 to current date).</p>
                <p>5. Download the digitally signed Encumbrance Certificate for zero government cost.</p>
              </div>
            </div>
          )}

          {activeTab === 'uds' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <h4 className="font-bold text-purple-900 mb-1">
                  Why UDS (Undivided Share) is the true wealth in Chennai Flats
                </h4>
                <p className="text-slate-700 text-xs leading-relaxed">
                  A flat structure depreciates over 30â€“50 years, but the land beneath it appreciates perpetually. In Chennai, the land title you own is called the <strong>Undivided Share of Land (UDS)</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
                <div className="text-xs text-amber-400 font-mono">Standard Chennai UDS Formula:</div>
                <div className="font-mono text-sm py-2 px-3 bg-slate-800 rounded">
                  UDS = (Individual Super Built-up Area / Total Project Built-up Area) Ã— Total Land Extent
                </div>
                <p className="text-xs text-slate-300">
                  Target a UDS ratio of at least <strong>40% to 50%</strong>. For instance, a 1,200 sq.ft flat should ideally have 500â€“600 sq.ft of UDS. In boutique developments in Anna Nagar, UDS can be as high as 55%!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'flood' && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 rounded-xl border border-teal-200">
                <h4 className="font-bold text-teal-900 mb-1">
                  Chennai Monsoon & Water Table Due Diligence
                </h4>
                <p className="text-slate-700 text-xs leading-relaxed">
                  Chennai experiences northeast monsoon rainfall. Smart real estate buyers always inspect elevation, natural drainage slopes, and proximity to surplus channels before booking land or ground-floor apartments.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Road Height vs Plot Level:</strong> Ensure the plot or stilt parking level is at least 2.5 to 3 feet higher than the crest of the connecting road.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Revenue Classification:</strong> Check the FMB (Field Measurement Book) sketch to ensure the plot is not classified as "Eri Poramboke" (lake bed), "Kalam", or "Meikkal" (grazing reserve).</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Groundwater Quality:</strong> Along ECR and South Chennai (Medavakkam / Madipakkam), test for TDS levels. Sweet water is typically available within 20â€“35 feet in prime residential pockets.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Need legal vetting assistance? Our TN panel advocates review documentation for all listings.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

