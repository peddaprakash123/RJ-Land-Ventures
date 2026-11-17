import React from 'react';
import { Property } from '../data/chennaiProperties';
import { openPropertyWhatsApp } from '../utils/whatsapp';
import { XLg, Heart, HeartFill, Trash3, ArrowRight, GeoAlt, Whatsapp, Share } from 'react-bootstrap-icons';

interface SavedPropertiesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Property[];
  onRemoveFavorite: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onClearAll: () => void;
}

export const SavedPropertiesDrawer: React.FC<SavedPropertiesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onSelectProperty,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const getPropertySlug = (prop: Property) =>
    prop.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const buildShortlistText = () => {
    const origin = window.location.origin;
    const lines = favorites.map((prop, idx) => {
      const url = `${origin}/property/${getPropertySlug(prop)}`;
      return `${idx + 1}. ${prop.title}\n   ${prop.priceDisplay} · ${prop.locality}\n   ${url}`;
    });
    return `Shortlisted Chennai Properties (${favorites.length})\n\n${lines.join('\n\n')}`;
  };

  const handleShareAll = async () => {
    const text = buildShortlistText();
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Shortlisted Chennai Properties', text });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.prompt('Copy shortlisted properties:', text);
    }
  };

  const handleWhatsAppAll = () => {
    const text = buildShortlistText();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <HeartFill className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-base">Shortlisted Chennai Properties</h3>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full tabular-nums">
              {favorites.length}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close saved properties drawer"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <XLg className="w-5 h-5" />
          </button>
        </div>

        {/* List of Saved */}
        <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar p-4 space-y-3">
          {favorites.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">No properties shortlisted yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Click the heart icon on any Chennai plot or flat card to save and compare them here.
              </p>
            </div>
          ) : (
            favorites.map((prop) => (
              <div
                key={prop.id}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-all space-y-2"
              >
                <div className="flex gap-3">
                  <img
                    src={prop.image}
                    alt={prop.title}
                    referrerPolicy="no-referrer"
                    onClick={() => {
                      onSelectProperty(prop);
                      onClose();
                    }}
                    className="w-20 h-16 rounded-lg object-cover shrink-0 border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider">
                        {prop.category}
                      </span>
                      {prop.type === 'flat' && prop.propertyStatus === 'For Rent' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                          For Rent
                        </span>
                      )}
                    </div>
                    <h4
                      onClick={() => {
                        onSelectProperty(prop);
                        onClose();
                      }}
                      className="text-xs font-bold text-slate-900 truncate hover:text-amber-700 cursor-pointer"
                    >
                      {prop.title}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 truncate">
                      <GeoAlt className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>{prop.locality}</span>
                    </div>
                    <div className="text-xs font-extrabold text-slate-900 mt-1 tabular-nums">
                      {prop.priceDisplay}
                      <span className="text-[10px] font-normal text-slate-500 ml-1">({prop.pricePerUnit})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <button
                    onClick={() => {
                      onSelectProperty(prop);
                      onClose();
                    }}
                    className="text-amber-700 hover:text-amber-800 font-semibold inline-flex items-center gap-1"
                  >
                    View Specs <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onRemoveFavorite(prop.id)}
                    aria-label={`Remove ${prop.title} from favorites`}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Remove"
                  >
                    <Trash3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleWhatsAppAll}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                <Whatsapp className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={handleShareAll}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-slate-700 bg-transparent border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Share className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={onClearAll}
                className="text-xs text-slate-500 hover:text-rose-600 transition-colors"
              >
                Clear All ({favorites.length})
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Back to Catalog
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
