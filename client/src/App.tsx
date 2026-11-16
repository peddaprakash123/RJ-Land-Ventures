import React, { useState, useMemo, useEffect } from 'react';
import {
  CHENNAI_PROPERTIES,
  CHENNAI_MICRO_MARKETS,
  Property,
} from './data/chennaiProperties';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { PostPropertyModal } from './components/PostPropertyModal';
import { LegalGuideModal } from './components/LegalGuideModal';
import { SavedPropertiesDrawer } from './components/SavedPropertiesDrawer';
import { VirtualTourModal } from './components/VirtualTourModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { openPropertyWhatsApp } from './utils/whatsapp';
import {
  fetchProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from './api/properties';
import {
  hasAdminSession,
  startAdminSession,
  endAdminSession,
} from './auth/adminAuth';
import {
  Search,
  GeoAlt,
  CheckCircle,
  Building,
  Heart,
  HeartFill,
  StarFill,
  ChatDots,
  ChatSquareText
} from 'react-bootstrap-icons';

export default function App() {
  // Show the built-in catalog immediately, then replace it with live MongoDB
  // data once the API responds.
  const [properties, setProperties] = useState<Property[]>(CHENNAI_PROPERTIES);
  const [propertiesError, setPropertiesError] = useState('');

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('singara_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [selectedApproval, setSelectedApproval] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'area-desc'>('featured');
  const [quickFilter, setQuickFilter] = useState<'all' | 'plots' | 'flats' | 'omr' | 'ecr' | 'budget'>('all');

  // Modals state
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPostPropertyModalOpen, setIsPostPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isLegalGuideModalOpen, setIsLegalGuideModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isVirtualTourOpen, setIsVirtualTourOpen] = useState(false);
  const [virtualTourProperty, setVirtualTourProperty] = useState<Property | null>(null);

  // Admin auth state (session persists while the browser tab is open)
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() =>
    hasAdminSession()
  );

  // Sync favorites to localStorage
  useEffect(() => {
    localStorage.setItem('singara_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Load property listings from the MongoDB API.
  useEffect(() => {
    let active = true;

    fetchProperties()
      .then((data) => {
        if (!active) return;
        setProperties(data);
        setPropertiesError('');
      })
      .catch((error) => {
        if (!active) return;
        console.error('Failed to load properties from the API:', error);
        setPropertiesError(
          'Live property data is temporarily unavailable. Showing the built-in Chennai listings.'
        );
      });

    return () => {
      active = false;
    };
  }, []);

  // Start each admin/public view at the top of the page.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [isAdminAuthenticated]);

  // Lock the page behind any open modal/drawer so only the card itself scrolls.
  const hasOpenOverlay =
    isDetailModalOpen ||
    isPostPropertyModalOpen ||
    isLegalGuideModalOpen ||
    isSavedDrawerOpen ||
    isVirtualTourOpen ||
    isAdminLoginOpen;

  useEffect(() => {
    if (!hasOpenOverlay) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [hasOpenOverlay]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddProperty = async (newProp: Property) => {
    const saved = await createProperty(newProp);
    setProperties((prev) => [saved, ...prev.filter((property) => property.id !== saved.id)]);
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((property) => property.id !== id));
    } catch (error) {
      console.error('Failed to delete property:', error);
      window.alert(
        'Could not delete the property. Check that the API server is running and try again.'
      );
    }
  };

  const handleUpdateProperty = async (updatedProp: Property) => {
    const saved = await updateProperty(updatedProp);
    setProperties((prev) =>
      prev.map((property) => (property.id === saved.id ? saved : property))
    );
  };

  const openPostProperty = () => {
    setEditingProperty(null);
    setIsPostPropertyModalOpen(true);
  };

  const openEditProperty = (property: Property) => {
    setEditingProperty(property);
    setIsPostPropertyModalOpen(true);
  };

  const closePostProperty = () => {
    setIsPostPropertyModalOpen(false);
    setEditingProperty(null);
  };

  const handleAdminLogin = () => {
    startAdminSession();
    setIsAdminAuthenticated(true);
    setIsAdminLoginOpen(false);
    setIsPostPropertyModalOpen(false);
    setEditingProperty(null);
  };

  const handleAdminLogout = () => {
    endAdminSession();
    setIsAdminAuthenticated(false);
    setIsPostPropertyModalOpen(false);
    setEditingProperty(null);
    setIsAdminLoginOpen(false);
  };

  const openPropertyDetail = (prop: Property) => {
    setActiveProperty(prop);
    setIsDetailModalOpen(true);
  };

  const openVirtualTour = (prop: Property) => {
    setVirtualTourProperty(prop);
    setIsVirtualTourOpen(true);
  };

  // Filter logic
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      // Quick filter preset
      if (quickFilter === 'plots' && item.type !== 'plot') return false;
      if (quickFilter === 'flats' && item.type !== 'flat') return false;
      if (quickFilter === 'omr' && item.zone !== 'OMR Corridor') return false;
      if (quickFilter === 'ecr' && item.zone !== 'ECR Coast') return false;
      if (quickFilter === 'budget' && item.price > 6000000) return false;

      // Chennai Zone filter
      if (selectedZone !== 'all' && item.zone !== selectedZone) {
        return false;
      }

      // Approval filter
      if (selectedApproval !== 'all') {
        if (!item.approval.includes(selectedApproval)) return false;
      }

      // Budget filter
      if (selectedBudget !== 'all') {
        if (selectedBudget === 'under50') {
          if (item.price > 5000000) return false;
        } else if (selectedBudget === '50to100') {
          if (item.price < 5000000 || item.price > 10000000) return false;
        } else if (selectedBudget === '100to250') {
          if (item.price < 10000000 || item.price > 25000000) return false;
        } else if (selectedBudget === 'above250') {
          if (item.price < 25000000) return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.title.toLowerCase().includes(q) ||
          item.locality.toLowerCase().includes(q) ||
          item.zone.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q) ||
          (item.bhk && item.bhk.toLowerCase().includes(q)) ||
          item.approval.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'area-desc') return b.areaSqFt - a.areaSqFt;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [properties, selectedZone, selectedBudget, selectedApproval, searchQuery, sortBy, quickFilter]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedZone('all');
    setSelectedBudget('all');
    setSelectedApproval('all');
    setQuickFilter('all');
  };

  const favoriteProperties = useMemo(() => {
    return properties.filter((p) => favorites.includes(p.id));
  }, [properties, favorites]);

  // Admin console: after a successful admin login, show only the admin workspace.
  if (isAdminAuthenticated) {
    return (
      <>
        <AdminDashboard
          properties={properties}
          onPostProperty={openPostProperty}
          onEditProperty={openEditProperty}
          onLogout={handleAdminLogout}
          onDeleteProperty={handleDeleteProperty}
          syncError={propertiesError}
        />

        <PostPropertyModal
          isOpen={isPostPropertyModalOpen}
          onClose={closePostProperty}
          onAddProperty={handleAddProperty}
          onUpdateProperty={handleUpdateProperty}
          editingProperty={editingProperty}
        />

        <WhatsAppFloat />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Bar Navigation */}
      <Navbar
        onOpenPostProperty={openPostProperty}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        savedCount={favorites.length}
      />

      {/* Main Container */}
      <main className="flex-1">
        {propertiesError && (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-[11px] font-semibold text-amber-800">
            {propertiesError}
          </div>
        )}

        {/* Pradhan-Style Hero Section */}
        <section className="relative bg-white pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Top Split: Text & Visual Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Headline & Value Proposition */}
              <div className="lg:col-span-7 space-y-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] text-balance">
                  Find Your Dream Property. Invest in Your Future.
                </h1>

                <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                  Discover premium properties and investment opportunities in prime locations.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => {
                      document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm"
                  >
                    Explore Properties
                  </button>
                  <button
                    onClick={() => window.open('https://wa.me/916300409615', '_blank', 'noopener,noreferrer')}
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    Contact Us
                  </button>
                </div>
              </div>

              {/* Right Column: Pradhan Visual Showcase Frame with Floating Cards */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Hero Image Container */}
                  <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                    <img
                      src="/src/assets/images/chennai_hero_luxury_1794240290491.jpg"
                      alt="Chennai Luxury Real Estate"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  </div>

                  {/* Floating info card 1: top-left (display only, not a link) */}
                  <div className="absolute -top-4 -left-4 sm:-left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-200/90 flex items-center gap-3">
                    <img
                      src="/src/assets/images/chennai_coastal_land_1794240292550.jpg"
                      alt="ECR Plot"
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="text-xs">
                      <span className="text-[10px] font-bold text-amber-700 uppercase">Top Plot</span>
                      <div className="font-bold text-slate-900">1 Ground in Akkarai, ECR</div>
                      <div className="text-slate-500 font-semibold tabular-nums">₹1.95 Cr· CMDA Approved</div>
                    </div>
                  </div>

                  {/* Floating info card 2: bottom-right (display only, not a link) */}
                  <div className="absolute -bottom-5 -right-3 sm:-right-5 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-200/90 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                      <Building className="w-5 h-5" />
                    </div>
                    <div className="text-xs">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">New Launch</span>
                      <div className="font-bold text-slate-900">3 BHK in OMR Cyber Towers</div>
                      <div className="text-slate-500 font-semibold tabular-nums">₹1.03 Cr· High UDS</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Elevated Pradhan Multi-Tab Search Box */}
            <div className="mt-12 bg-white rounded-3xl shadow-xl border border-slate-200 p-4 sm:p-6">
              {/* Input Fields Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
                {/* Location / Keyword Search */}
                <div className="lg:col-span-5 relative">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Locality or Landmark
                  </label>
                  <div className="relative">
                    <GeoAlt className="w-4 h-4 text-amber-600 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. OMR, ECR, Anna Nagar, Velachery..."
                      className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-slate-50"
                    />
                  </div>
                </div>

                {/* Budget */}
                <div className="lg:col-span-4">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Budget Range
                  </label>
                  <select
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                    aria-label="Budget Range"
                    className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-slate-50"
                  >
                    <option value="all">Any Price</option>
                    <option value="under50">Under ₹50 Lakhs (Affordable Plots)</option>
                    <option value="50to100">₹50 Lakhs - ₹1.0 Crore</option>
                    <option value="100to250">₹1.0 Crore - ₹2.5 Crore</option>
                    <option value="above250">Above ₹2.5 Crore (Luxury & 1+ Ground)</option>
                  </select>
                </div>

                {/* Submit Action */}
                <div className="lg:col-span-3">
                  <button
                    onClick={() => {
                      document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <Search className="w-3.5 h-3.5 text-amber-400" />
                    <span>Find Properties</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Below Image – Content */}
            <div className="mt-10">
              <div className="max-w-3xl">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  More Than Just a Property. A Better Future.
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mt-2">
                  Your trusted partner in finding exceptional properties and smarter real estate investments.
                </p>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Verified</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Trusted properties</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <GeoAlt className="w-4 h-4 text-amber-600" />
                    <span>Prime Locations</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Great opportunities</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <ChatSquareText className="w-4 h-4 text-blue-600" />
                    <span>Expert Support</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Personal guidance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular / Trending Properties Section (Pradhan Style) */}
        <section id="properties" className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="text-xs font-bold tracking-wider text-amber-700 uppercase mb-1">
                Curated Chennai Portfolio
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Trending Lands & Flats in Chennai
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Hand-picked CMDA & DTCP approved plots and high-UDS flats verified by Madras High Court advocates.
              </p>
            </div>

            {/* Quick Filter Pill Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {[
                { label: 'All', id: 'all' },
                { label: 'Villa Plots', id: 'plots' },
                { label: 'Luxury Flats', id: 'flats' },
                { label: 'OMR IT', id: 'omr' },
                { label: 'ECR Beach', id: 'ecr' },
                { label: '< ₹60L', id: 'budget' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setQuickFilter(pill.id as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    quickFilter === pill.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 mt-8 p-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No properties matched your search</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try widening your search keywords or reset filters to see all available Chennai plots and flats.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {filteredProperties.map((property) => {
                const isFav = favorites.includes(property.id);
                return (
                  <div
                    key={property.id}
                    className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
                  >
                    {/* Image Area with Tour Badge */}
                    <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                      <img
                        src={property.image}
                        alt={property.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />

                      {/* Top Badges */}
                      <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md text-white">
                          {property.category}
                        </span>
                        {property.type === 'flat' && property.propertyStatus === 'For Rent' && (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md text-white bg-blue-600/90">
                            For Rent
                          </span>
                        )}
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(property.id);
                        }}
                        className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-rose-600 transition-all shadow-sm"
                        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {isFav ? <HeartFill className="w-4 h-4 text-rose-500" /> : <Heart className="w-4 h-4" />}
                      </button>

                      {/* Price on Image Bottom Left */}
                      <div className="absolute bottom-3.5 left-3.5 text-white">
                        <div className="text-xl font-extrabold tracking-tight tabular-nums">
                          {property.priceDisplay}
                        </div>
                        <div className="text-[11px] text-slate-200 tabular-nums">
                          {property.pricePerUnit}
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        {/* Unboxed Metadata with Typographic Separator */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                          <span>{property.zone}</span>
                          <span aria-hidden="true">·</span>
                          <span>{property.facing} Facing</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-700 font-medium">{property.approval}</span>
                        </div>

                        <h3
                          onClick={() => openPropertyDetail(property)}
                          className="font-bold text-base text-slate-900 hover:text-amber-700 cursor-pointer transition-colors line-clamp-1"
                        >
                          {property.title}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1 line-clamp-1">
                          <GeoAlt className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{property.locality}</span>
                        </div>

                        {/* Specifications Strip */}
                        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[11px] text-slate-400 block">Extent Area</span>
                            <span className="font-bold text-slate-900 tabular-nums">
                              {property.areaSqFt.toLocaleString('en-IN')} sq.ft
                            </span>
                            {property.landUnits && (
                              <span className="text-[10px] text-amber-700 block font-medium">
                                {property.landUnits.grounds} Ground ({property.landUnits.cents} Cents)
                              </span>
                            )}
                            {property.bhk && (
                              <span className="text-[10px] text-blue-700 block font-medium">
                                {property.bhk}
                              </span>
                            )}
                            {property.type === 'flat' &&
                              (property.bedrooms || property.bathrooms) && (
                                <span className="text-[10px] text-slate-500 block font-medium">
                                  {property.bedrooms
                                    ? `${property.bedrooms} Bedrooms`
                                    : ''}
                                  {property.bedrooms && property.bathrooms ? ' · ' : ''}
                                  {property.bathrooms
                                    ? `${property.bathrooms} Bathrooms`
                                    : ''}
                                </span>
                              )}
                          </div>

                          <div>
                            <span className="text-[11px] text-slate-400 block">Approach & Water</span>
                            <span className="font-semibold text-slate-800 line-clamp-1 text-[11px]">
                              {property.roadWidth}
                            </span>
                            <span className="text-[10px] text-slate-500 line-clamp-1">
                              {property.waterSource}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                        <button
                          onClick={() => openPropertyDetail(property)}
                          className="flex-1 py-2 px-3 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center whitespace-nowrap"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => openPropertyWhatsApp(property)}
                          title="Share this property card on WhatsApp"
                          aria-label="Share this property card details on WhatsApp Legal Desk"
                          className="py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-1 whitespace-nowrap shadow-xs"
                        >
                          <ChatDots className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Growth Hotspots / Chennai Neighborhoods Section */}
        <section id="neighborhoods" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold tracking-wider text-amber-700 uppercase mb-1">
                Market Overview
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Chennai’s Top Real Estate Growth Areas
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Price ranges, annual appreciation, and what makes each area attractive for buyers and investors.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedZone('all');
                document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors self-start md:self-auto"
            >
              Browse All Listings →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CHENNAI_MICRO_MARKETS.map((market) => {
              const isSelected = selectedZone === market.code;
              return (
                <div
                  key={market.name}
                  onClick={() => {
                    setSelectedZone(market.code);
                    document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-amber-50/50 border-amber-500 shadow-md ring-1 ring-amber-500'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-700 transition-colors">
                      {market.name}
                    </h3>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 tabular-nums">
                      {market.growthRate}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mt-1.5 tabular-nums font-semibold">
                    {market.avgSqftPrice}
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {market.highlights}
                  </p>

                  <div className="mt-4 pt-3.5 border-t border-slate-100 text-xs">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Ideal for
                    </span>
                    <span className="text-slate-600 font-medium leading-relaxed">
                      {market.recommendedFor}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="bg-white border-y border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="text-xs font-bold tracking-wider text-amber-700 uppercase mb-1">
                Your Property Journey, Made Simple
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                How RJ Land Ventures Works
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Finding the right plot should be easy and stress-free. From exploring verified properties to completing the registration, we guide you at every step.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Search & Find Your Property',
                  desc: 'Explore a range of residential plots and flats that match your needs. Filter properties by location, budget, plot size, and approval status to find the right option for you.',
                },
                {
                  step: '02',
                  title: 'Explore Before You Visit',
                  desc: 'Get a closer look at your shortlisted property through virtual tours. Check the layout, road access, plot boundaries, and surroundings before planning a site visit.',
                },
                {
                  step: '03',
                  title: 'Get Legal Guidance on WhatsApp',
                  desc: 'Have questions about a property? Simply share the property details with our team on WhatsApp. Get assistance with document checks, Patta details, and property-related legal guidance.',
                },
                {
                  step: '04',
                  title: 'Complete Your Registration with Confidence',
                  desc: "Once you've made your decision, we'll guide you through the registration process. Get support with documentation, advocate verification, and Sub-Registrar formalities, with transparent pricing and no brokerage.",
                },
              ].map((item) => (
                <div key={item.step} className="p-6 bg-slate-50 rounded-3xl border border-slate-200 relative">
                  <div className="text-3xl font-black text-amber-600/30 tabular-nums mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client Testimonials */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs font-bold tracking-wider text-amber-700 uppercase mb-1">
              Customer Stories
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Trusted by 1,800+ Chennai Property Buyers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'K. Balasubramanian',
                role: 'Tech Lead at TCS, Siruseri',
                location: 'Purchased 1 Ground Villa Plot in Siruseri',
                quote: 'We were looking for a villa plot in Siruseri but wanted to understand the layout and road access before visiting. The virtual tour helped us get a clear picture, and the team guided us through the property documents. The overall experience was smooth and hassle-free.',
              },
              {
                name: 'Meera & Arvind Raman',
                role: 'NRI Investors, Singapore',
                location: 'Purchased Coastal Villa Land in Akkarai, ECR',
                quote: 'Since we live in Singapore, buying land in Chennai from abroad was a big decision for us. We wanted to be sure about the property documents and ownership details. The team helped us understand the verification process and made things much easier.',
              },
              {
                name: 'Dr. S. Jayakumar',
                role: 'Ramachandra Hospital, Porur',
                location: 'Purchased 3 BHK Residence in Anna Nagar',
                quote: 'What I liked most was the clarity throughout the buying process. The team explained the property details, pricing, and UDS calculations without making things complicated. Everything was handled transparently, which gave us confidence in our decision.',
              },
            ].map((t, idx) => (
              <div key={idx} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <StarFill key={i} className="w-4 h-4 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="font-bold text-xs text-slate-900">{t.name}</div>
                  <div className="text-[11px] text-slate-500">{t.role}</div>
                  <div className="text-[10px] text-amber-700 font-semibold mt-0.5">{t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer
        onOpenLegalGuide={() => setIsLegalGuideModalOpen(true)}
        onOpenPostProperty={openPostProperty}
      />

      {/* Modals & Drawers */}
      <PropertyDetailModal
        property={activeProperty}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        isFavorite={activeProperty ? favorites.includes(activeProperty.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      <VirtualTourModal
        property={virtualTourProperty}
        isOpen={isVirtualTourOpen}
        onClose={() => setIsVirtualTourOpen(false)}
      />

      <PostPropertyModal
        isOpen={isPostPropertyModalOpen}
        onClose={closePostProperty}
        onAddProperty={handleAddProperty}
        onUpdateProperty={handleUpdateProperty}
        editingProperty={editingProperty}
      />

      <LegalGuideModal
        isOpen={isLegalGuideModalOpen}
        onClose={() => setIsLegalGuideModalOpen(false)}
      />

      <SavedPropertiesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        favorites={favoriteProperties}
        onRemoveFavorite={toggleFavorite}
        onSelectProperty={openPropertyDetail}
        onClearAll={() => setFavorites([])}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLogin}
      />

      <WhatsAppFloat />
    </div>
  );
}

