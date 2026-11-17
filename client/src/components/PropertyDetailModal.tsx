import React, { useEffect, useRef, useState } from 'react';
import { Property } from '../data/chennaiProperties';
import { openPropertyWhatsApp } from '../utils/whatsapp';
import {
  XLg,
  GeoAlt,
  Compass,
  CheckCircle,
  Calendar3,
  Layers,
  Droplet,
  SignpostSplit,
  Share,
  Heart,
  HeartFill,
  ChatSquareText,
  Building,
  CarFront,
  CheckLg,
  BoxArrowUpRight,
  Lock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'react-bootstrap-icons';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Always open at the top of the details panel, even when switching between
  // properties or reopening the modal after it was scrolled down.
  useEffect(() => {
    if (!isOpen) return;

    setSelectedImageIndex(0);
    setCopiedLink(false);
    setIsImageViewerOpen(false);

    const frame = requestAnimationFrame(() => {
      contentRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen, property?.id]);

  if (!isOpen || !property) return null;

  const showDetails = property.showDetailsInView !== false;
  const gallery = property.gallery && property.gallery.length > 0 ? property.gallery : [property.image];
  const hasMultipleImages = gallery.length > 1;

  const goPrevImage = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    setSelectedImageIndex((idx) => (idx - 1 + gallery.length) % gallery.length);
  };

  const goNextImage = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    setSelectedImageIndex((idx) => (idx + 1) % gallery.length);
  };

  const handleShare = async () => {
    const slug = property.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    const propertyUrl = `${window.location.origin}/property/${encodeURIComponent(slug)}`;
    const shareData = {
      title: property.title,
      text: `${property.title} - ${property.priceDisplay}\n${property.address}`,
      url: propertyUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(propertyUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      window.prompt('Copy this property link:', propertyUrl);
    }
  };

  const handleWhatsApp = () => {
    openPropertyWhatsApp(property);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Property details"
      className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center overflow-hidden bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4"
    >
      <div className="relative flex h-full w-full max-w-4xl flex-col overflow-hidden border-0 border-slate-200 bg-white shadow-2xl sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl sm:border">
        {/* Fixed Modal Header */}
        <div className="px-5 sm:px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded border border-amber-200">
              {property.type === 'plot' ? 'Verified Chennai Land / Plot' : 'Verified Flat / Apartment'}
            </span>
            {property.type === 'flat' && (
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded border ${
                  property.propertyStatus === 'For Rent'
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {property.propertyStatus ?? 'For Sale'}
              </span>
            )}
            <span className="hidden sm:inline-block text-xs font-medium text-slate-500">
              {property.approval}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(property.id)}
              className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
              title={isFavorite ? 'Remove from saved' : 'Save property'}
              aria-label={isFavorite ? 'Remove from saved properties' : 'Save property to favorites'}
            >
              {isFavorite ? (
                <HeartFill className="w-5 h-5 text-rose-500" />
              ) : (
                <Heart className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              title="Share property"
              aria-label="Share property"
            >
              {copiedLink ? <CheckLg className="w-5 h-5 text-emerald-600" /> : <Share className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors ml-1"
              aria-label="Close property details modal"
            >
              <XLg className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div
          ref={contentRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain no-scrollbar p-5 sm:p-6 space-y-6"
        >
          {/* Main Title and Price */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {property.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 mt-1.5">
                <GeoAlt className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{property.address}</span>
                {property.googleMapsUrl && (
                  <a
                    href={property.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
                  >
                    <span>Google Maps</span>
                    <BoxArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="text-left md:text-right shrink-0">
              <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {property.priceDisplay}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5 tabular-nums">
                {property.pricePerUnit}
              </div>
            </div>
          </div>

          {/* Detailed property information (hidden when the owner selects "No") */}
          <div className={showDetails ? 'space-y-6' : 'hidden'}>
          {/* Image Gallery */}
          <div className="space-y-3">
            <div
              className="relative aspect-16/9 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-zoom-in group"
              onClick={() => setIsImageViewerOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsImageViewerOpen(true);
                }
              }}
              aria-label="Open image in full view"
            >
              <img
                src={gallery[selectedImageIndex] || property.image}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />
              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    onClick={goPrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center shadow-md transition-colors z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center shadow-md transition-colors z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded">
                Photo {selectedImageIndex + 1} of {gallery.length} · Click to view full
              </div>
            </div>

            {/* Thumbnail Strip */}
            {hasMultipleImages && (
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx ? 'border-amber-600 scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Area Extent</span>
              <div className="text-base font-bold text-slate-900 mt-0.5 tabular-nums">
                {property.areaSqFt.toLocaleString('en-IN')} sq.ft
              </div>
              {property.landUnits && (
                <div className="text-[11px] text-amber-700 font-medium">
                  {property.landUnits.grounds} Ground ({property.landUnits.cents} Cents)
                </div>
              )}
              {property.bhk && (
                <div className="text-[11px] text-blue-700 font-medium">
                  {property.bhk}
                </div>
              )}
              {(property.bedrooms || property.bathrooms) && (
                <div className="text-[11px] text-slate-600 font-medium">
                  {property.bedrooms
                    ? `${property.bedrooms} Bedrooms`
                    : ''}
                  {property.bedrooms && property.bathrooms ? ' · ' : ''}
                  {property.bathrooms
                    ? `${property.bathrooms} Bathrooms`
                    : ''}
                </div>
              )}
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Facing / Vastu</span>
              <div className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-slate-600" />
                {property.facing} Facing
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">
                100% Vastu Compliant
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Possession</span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {property.possession}
              </div>
              <div className="text-[11px] text-slate-500">
                Direct Registration
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Statutory Approval</span>
              <div className="text-sm font-bold text-slate-900 mt-0.5 truncate" title={property.approval}>
                {property.approval}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">
                {property.pattaStatus}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">About this Property</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Highlights & Chennai Specifics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-2.5">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Key Features & Chennai Advantages
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {property.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wide">
                Infrastructure & Utilities
              </h4>
              <div className="space-y-2 text-slate-600">
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-blue-600 shrink-0" />
                  <span><strong>Water Source:</strong> {property.waterSource}</span>
                </div>
                <div className="flex items-center gap-2">
                  <SignpostSplit className="w-4 h-4 text-slate-600 shrink-0" />
                  <span><strong>Approach Road:</strong> {property.roadWidth}</span>
                </div>
                {property.uds && (
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600 shrink-0" />
                    <span><strong>Undivided Share of Land (UDS):</strong> {property.uds} sq.ft</span>
                  </div>
                )}
                {property.landType && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-600 shrink-0" />
                    <span><strong>Land Type:</strong> {property.landType}</span>
                  </div>
                )}
                {property.carParking && (
                  <div className="flex items-center gap-2">
                    <CarFront className="w-4 h-4 text-blue-600 shrink-0" />
                    <span><strong>Parking:</strong> {property.carParking}</span>
                  </div>
                )}
                {property.liftAccess !== undefined && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Lift Access:</strong> {property.liftAccess ? 'Yes' : 'No'}</span>
                  </div>
                )}
                {property.cctvAccess !== undefined && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>CCTV Security:</strong> {property.cctvAccess ? 'Yes' : 'No'}</span>
                  </div>
                )}
                {property.buildingAge && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-600 shrink-0" />
                    <span><strong>Building Age:</strong> {property.buildingAge}</span>
                  </div>
                )}
                {property.floorNumber && (
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600 shrink-0" />
                    <span><strong>Floor:</strong> {property.floorNumber}</span>
                  </div>
                )}
                {property.handoverDate && (
                  <div className="flex items-center gap-2">
                    <Calendar3 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span><strong>Handover Date:</strong> {property.handoverDate}</span>
                  </div>
                )}
                {property.reraNumber && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>TNRERA Number:</strong> {property.reraNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">Amenities & Infrastructure</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {property.amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0"></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Chennai Landmarks */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">Strategic Chennai Connectivity</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {property.nearbyLandmarks.map((lm, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-bold text-slate-900">{lm.name}</div>
                  <div className="text-amber-700 font-semibold mt-1 tabular-nums">{lm.distance}</div>
                </div>
              ))}
            </div>
          </div>
          </div>

          {!showDetails && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Full Property Details Kept Private
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                The owner has chosen not to publish full specifications, photos and documents
                publicly. Message our WhatsApp Legal Desk for complete verified details.
              </p>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className={`px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center gap-3 shrink-0 ${showDetails ? 'justify-end' : 'justify-between'}`}>
          {!showDetails && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
              <Lock className="w-3.5 h-3.5" />
              Full details are private
            </span>
          )}

          <button
            onClick={handleWhatsApp}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-sm whitespace-nowrap"
          >
            <ChatSquareText className="w-4 h-4" />
            WhatsApp Legal Desk
          </button>
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      {isImageViewerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Full image view"
        >
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 text-white border-b border-white/10">
            <button
              onClick={() => setIsImageViewerOpen(false)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-semibold transition-colors"
              aria-label="Back to details"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="text-xs sm:text-sm text-white/80 truncate px-3">
              {property.title} · {selectedImageIndex + 1} / {gallery.length}
            </div>
            <button
              onClick={() => setIsImageViewerOpen(false)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close image view"
            >
              <XLg className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 relative flex items-center justify-center p-4 sm:p-8 overflow-auto">
            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={goPrevImage}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={goNextImage}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            <img
              src={gallery[selectedImageIndex] || property.image}
              alt={property.title}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
