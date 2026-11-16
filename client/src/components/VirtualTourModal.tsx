import React, { useState } from 'react';
import { Property } from '../data/chennaiProperties';
import { openPropertyWhatsApp } from '../utils/whatsapp';
import {
  XLg,
  ArrowRepeat,
  ArrowsFullscreen,
  Eye,
  ChatSquareText,
  ChevronLeft,
  ChevronRight,
} from 'react-bootstrap-icons';

interface VirtualTourModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VirtualTourModal: React.FC<VirtualTourModalProps> = ({
  property,
  isOpen,
  onClose,
}) => {
  const [activeViewIndex, setActiveViewIndex] = useState(0);
  const [panOffset, setPanOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen || !property) return null;

  // Viewpoints for the tour
  const viewpoints = property.type === 'flat'
    ? [
        {
          id: 'living-hall',
          name: 'Main Living Lounge & Balcony',
          image: property.gallery[0] || property.image,
          description: 'Spacious 24-ft living room with Italian marble flooring, 11-ft clear ceiling height, and floor-to-ceiling glass sliding doors opening to the coastal balcony.',
          hotspots: ['Italian Marble Flooring', 'Panoramic Sea Breeze Balcony', 'Vastu North-East Corner'],
        },
        {
          id: 'master-bedroom',
          name: 'Master Suite & Walk-in Wardrobe',
          image: property.gallery[1] || property.image,
          description: 'King-sized master bedroom with sound-insulated acoustic double-glazed windows, solid teak wood flooring, and en-suite spa bathroom.',
          hotspots: ['Burma Teak Joinery', 'Smart AC Ducts', 'Zero Road Noise'],
        },
        {
          id: 'skyline-aerial',
          name: 'Terrace & Aerial Skyline View',
          image: property.gallery[2] || property.gallery[0] || property.image,
          description: 'Elevated view of the Chennai skyline, Bay of Bengal coastline, and landscaped tropical podium amenities.',
          hotspots: ['Infinity Lap Pool', 'Bay of Bengal Horizon', 'Podium Gardens'],
        },
      ]
    : [
        {
          id: 'avenue-entrance',
          name: 'Layout Entrance & 40-ft Avenue',
          image: property.gallery[0] || property.image,
          description: 'Grand entrance archway with 24/7 security boom barrier, broad 40-ft bitumen asphalt avenue, and subterranean storm water drains.',
          hotspots: ['40-ft Blacktop Road', 'Underground EB Lines', 'Lush Avenue Palm Trees'],
        },
        {
          id: 'plot-boundary',
          name: 'Marked Plot Extent & Boundary',
          image: property.gallery[1] || property.image,
          description: 'Clean demarcated plot stones with clear frontage, 100% Vastu East facing, and sweet groundwater table at 25 feet.',
          hotspots: ['100% East Facing', 'Individual Patta Stone', 'Zero Waterlogging Elevation'],
        },
        {
          id: 'surrounding-greens',
          name: 'Surrounding Green Reserve & Gated Park',
          image: property.gallery[2] || property.gallery[0] || property.image,
          description: 'Lush children park, senior citizen reflexology walking pathway, and solar street illumination across all internal layout lanes.',
          hotspots: ['Children Play Area', 'Solar Streetlights', 'Jogging Track'],
        },
      ];

  const currentView = viewpoints[activeViewIndex] || viewpoints[0];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX - panOffset);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newOffset = e.clientX - dragStartX;
    // Bound the pan offset between -150px and 150px for pleasant interactive feel
    if (newOffset >= -200 && newOffset <= 200) {
      setPanOffset(newOffset);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const nextView = () => {
    setActiveViewIndex((prev) => (prev + 1) % viewpoints.length);
    setPanOffset(0);
  };

  const prevView = () => {
    setActiveViewIndex((prev) => (prev - 1 + viewpoints.length) % viewpoints.length);
    setPanOffset(0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain no-scrollbar bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div
        className={`relative w-full ${
          isFullscreen ? 'max-w-7xl h-[95vh]' : 'max-w-5xl h-auto'
        } bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col text-white transition-all`}
      >
        {/* Top Bar */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold bg-amber-500/20 text-amber-400 rounded-md border border-amber-500/30">
              <Eye className="w-3.5 h-3.5" />
              Interactive Virtual Tour
            </span>
            <div className="hidden sm:block">
              <h3 className="text-sm font-bold text-white truncate max-w-md">{property.title}</h3>
              <p className="text-[11px] text-slate-400">{property.locality} · {property.priceDisplay}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden sm:block"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              <ArrowsFullscreen className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Close virtual tour"
            >
              <XLg className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Virtual Tour Canvas Viewport */}
        <div
          className="relative flex-1 bg-black min-h-[380px] sm:min-h-[460px] overflow-hidden select-none cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Panoramic Image with Transform Pan */}
          <div
            className="w-full h-full relative transition-transform duration-100 ease-out flex items-center justify-center"
            style={{
              transform: `scale(1.15) translateX(${panOffset}px)`,
            }}
          >
            <img
              src={currentView.image}
              alt={currentView.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />
          </div>

          {/* Interactive Drag Hint */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] text-slate-300 border border-slate-700/60 flex items-center gap-2 pointer-events-none shadow-lg">
            <ArrowRepeat className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Click & drag horizontally to pan the view</span>
          </div>

          {/* Prev / Next Perspective Controls */}
          <button
            onClick={prevView}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center backdrop-blur-md border border-slate-700 transition-all hover:scale-105"
            aria-label="Previous viewpoint"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextView}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center backdrop-blur-md border border-slate-700 transition-all hover:scale-105"
            aria-label="Next viewpoint"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Hotspots Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center gap-2 pointer-events-none">
            {currentView.hotspots.map((hotspot, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 backdrop-blur-md text-amber-300 text-xs px-3 py-1.5 rounded-lg border border-amber-500/40 shadow-lg flex items-center gap-1.5 pointer-events-auto"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <span>{hotspot}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Viewpoints Selector Bar */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Thumbnails to Switch Views */}
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {viewpoints.map((vp, index) => (
              <button
                key={vp.id}
                onClick={() => {
                  setActiveViewIndex(index);
                  setPanOffset(0);
                }}
                className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all shrink-0 ${
                  activeViewIndex === index
                    ? 'bg-slate-800 border-amber-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <img
                  src={vp.image}
                  alt={vp.name}
                  className="w-12 h-10 rounded-lg object-cover"
                />
                <div className="text-xs">
                  <div className="font-bold text-white truncate max-w-[140px]">{vp.name}</div>
                  <div className="text-[10px] text-slate-400">Angle 0{index + 1}</div>
                </div>
              </button>
            ))}
          </div>

          {/* CTA: Share property details on WhatsApp */}
          <button
            onClick={() => openPropertyWhatsApp(property)}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <ChatSquareText className="w-4 h-4" />
            WhatsApp Legal Desk
          </button>
        </div>
      </div>
    </div>
  );
};
