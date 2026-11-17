import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { NotFound } from './components/NotFound';
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
  ChatSquareText,
  ChevronLeft,
  ChevronRight,
  Share,
} from 'react-bootstrap-icons';

const getPropertySlug = (prop: Property) =>
  prop.title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

const toUrlSlug = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

const PropertyCardImage: React.FC<{
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onForward: (property: Property) => void;
}> = ({ property, isFavorite, onToggleFavorite, onForward }) => {
  const gallery = property.gallery && property.gallery.length > 0 ? property.gallery : [property.image];
  const [index, setIndex] = useState(0);
  const hasMultiple = gallery.length > 1;

  useEffect(() => {
    setIndex(0);
  }, [property.id]);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i - 1 + gallery.length) % gallery.length);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % gallery.length);
  };

  return (
    <>
      <div className="relative aspect-16/10 bg-slate-100 overflow-hidden group/image">
        <img
          src={gallery[index]}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25 pointer-events-none" />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all opacity-100 sm:opacity-0 sm:group-hover/image:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all opacity-100 sm:opacity-0 sm:group-hover/image:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

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

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-rose-600 transition-all shadow-sm z-10"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? <HeartFill className="w-4 h-4 text-rose-500" /> : <Heart className="w-4 h-4" />}
        </button>

        <div className="absolute bottom-3.5 left-3.5 text-white z-10">
          <div className="text-xl font-extrabold tracking-tight tabular-nums">{property.priceDisplay}</div>
          <div className="text-[11px] text-slate-200 tabular-nums">{property.pricePerUnit}</div>
        </div>

        {isFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onForward(property);
            }}
            className="absolute bottom-3.5 right-3.5 z-10 p-2 text-white bg-transparent hover:bg-black/30 rounded-full transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
            title="Share property"
            aria-label="Share property"
          >
            <Share className="w-4 h-4" />
          </button>
        )}
      </div>
    </>
  );
};

export default function App() {
  const [properties, setProperties] = useState<Property[]>(CHENNAI_PROPERTIES);
  const [propertiesError, setPropertiesError] = useState('');
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('singara_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const locationSearchRef = useRef<HTMLDivElement>(null);
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [selectedApproval, setSelectedApproval] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'area-desc'>('featured');
  const [quickFilter, setQuickFilter] = useState<'all' | 'plots' | 'flats' | 'omr' | 'ecr' | 'budget'>('all');

  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [propertyNotFound, setPropertyNotFound] = useState(false);
  const [isPostPropertyModalOpen, setIsPostPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isLegalGuideModalOpen, setIsLegalGuideModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isVirtualTourOpen, setIsVirtualTourOpen] = useState(false);
  const [virtualTourProperty, setVirtualTourProperty] = useState<Property | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => hasAdminSession());

  const reloadHandledRef = useRef(false);

  const isKnownRoute = (pathname: string) => {
    const p = pathname.replace(/\/+$/, '') || '/';
    if (
      ['/', '/properties', '/flats', '/land', '/plots', '/locations', '/our-services', '/services', '/how-it-works', '/about', '/contact', '/admin'].includes(p)
    ) return true;
    if (/^\/locations\/[^/]+$/.test(p)) return true;
    if (/^\/property\/[^/]+$/.test(p)) return true;
    return false;
  };

  useEffect(() => {
    localStorage.setItem('singara_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    let active = true;
    setIsLoadingProperties(true);
    setPropertiesError('');
    fetchProperties()
      .then((data) => {
        if (!active) return;
        setProperties(data);
      })
      .catch((error) => {
        console.error('Failed to fetch properties from API:', error);
        if (!active) return;
        const msg = error instanceof Error ? error.message : '';
        const isNetwork =
          /failed to fetch|networkerror|network request failed|load failed|aborted|timeout/i.test(msg);
        setPropertiesError(
          isNetwork
            ? 'Network issue while loading properties. Please check your connection and try again.'
            : 'Live property data is temporarily unavailable. Showing the built-in Chennai listings.'
        );
      })
      .finally(() => {
        if (active) setIsLoadingProperties(false);
      });
    return () => { active = false; };
  }, []);

  const hasOpenOverlay =
    isDetailModalOpen || isPostPropertyModalOpen || isLegalGuideModalOpen || isSavedDrawerOpen || isVirtualTourOpen || isAdminLoginOpen;

  useEffect(() => {
    if (!hasOpenOverlay) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [hasOpenOverlay]);

  const locationSuggestions = useMemo(() => {
    const suggestions = new Set<string>();
    CHENNAI_MICRO_MARKETS.forEach((m) => { suggestions.add(m.name); suggestions.add(m.code); });
    properties.forEach((p) => {
      if (p.locality) suggestions.add(p.locality);
      if (p.zone) suggestions.add(p.zone);
      if (p.address) suggestions.add(p.address);
      p.nearbyLandmarks?.forEach((l) => { if (l.name) suggestions.add(l.name); });
    });
    return Array.from(suggestions).filter(Boolean);
  }, [properties]);

  const filteredLocationSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return locationSuggestions.slice(0, 12);
    const starts = locationSuggestions.filter((s) => s.toLowerCase().startsWith(q));
    const contains = locationSuggestions.filter(
      (s) => !s.toLowerCase().startsWith(q) && s.toLowerCase().includes(q)
    );
    return [...starts, ...contains].slice(0, 12);
  }, [locationSuggestions, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationSearchRef.current && !locationSearchRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToId = (id: string, behavior: ScrollBehavior = 'smooth') => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        const nav = document.querySelector('header') as HTMLElement | null;
        const navH = nav?.offsetHeight ?? 72;
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - navH - 8;
          window.scrollTo({ top: Math.max(0, top), behavior });
        } else {
          window.scrollTo({ top: 0, behavior: 'auto' });
        }
      });
    });
  };

  // Route + URL state sync (URL reflects navigation; refresh/back-forward work)
  useEffect(() => {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (navEntry?.type === 'reload' && !reloadHandledRef.current) {
      reloadHandledRef.current = true;
      const p = location.pathname.replace(/\/+$/, '') || '/';
      if (p !== '/' || location.search || location.hash) {
        navigate('/', { replace: true });
        return;
      }
    }

    const path = location.pathname.replace(/\/+$/, '') || '/';
    const params = new URLSearchParams(location.search);

    const propMatch = path.match(/^\/property\/([^/]+)$/);
    if (propMatch) {
      const slug = decodeURIComponent(propMatch[1]);
      const prop = properties.find((p) => getPropertySlug(p) === slug) || properties.find((p) => p.id === slug);
      if (prop) {
        setActiveProperty(prop);
        setIsDetailModalOpen(true);
        setPropertyNotFound(false);
      } else {
        setActiveProperty(null);
        setIsDetailModalOpen(false);
        setPropertyNotFound(true);
      }
    } else {
      setIsDetailModalOpen(false);
      setActiveProperty(null);
      setPropertyNotFound(false);
    }

    if (path === '/admin') {
      const authed = hasAdminSession();
      setIsAdminAuthenticated(authed);
      setIsAdminLoginOpen(!authed);
    } else {
      if (hasAdminSession()) endAdminSession();
      setIsAdminLoginOpen(false);
      setIsAdminAuthenticated(false);
    }

    // Route-driven filters/views
    if (path === '/flats') {
      setQuickFilter('flats'); setSelectedZone('all'); setSearchQuery('');
    } else if (path === '/land' || path === '/plots') {
      setQuickFilter('plots'); setSelectedZone('all'); setSearchQuery('');
    } else if (path === '/properties' || path === '/') {
      const q = params.get('location') || params.get('q') || '';
      setSearchQuery(q ? q.replace(/-/g, ' ') : '');
      setSelectedZone(params.get('zone') || 'all');
      setSelectedBudget(params.get('budget') || 'all');
      setSelectedApproval(params.get('approval') || 'all');
      setSortBy((params.get('sort') as any) || 'featured');
      setQuickFilter((params.get('quick') as any) || 'all');
    }

    // Section scrolls on route
    if (path === '/properties' || path === '/flats' || path === '/land' || path === '/plots') {
      scrollToId('properties');
    } else if (path === '/our-services' || path === '/services') {
      scrollToId('our-services');
    } else if (path === '/how-it-works') {
      scrollToId('how-it-works');
    } else if (path === '/') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.pathname, location.search, location.hash, properties]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  const handleAddProperty = async (newProp: Property) => {
    const saved = await createProperty(newProp);
    setProperties((prev) => [saved, ...prev.filter((property) => property.id !== saved.id)]);
  };
  const handleDeleteProperty = async (id: string) => {
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((property) => property.id !== id));
      setFavorites((prev) => prev.filter((favId) => favId !== id));
    } catch (error) {
      console.error('Failed to delete property:', error);
      window.alert('Could not delete the property. Check that the API server is running and try again.');
    }
  };
  const handleUpdateProperty = async (updatedProp: Property) => {
    const saved = await updateProperty(updatedProp);
    setProperties((prev) => prev.map((property) => (property.id === saved.id ? saved : property)));
  };

  const openPostProperty = () => { setEditingProperty(null); setIsPostPropertyModalOpen(true); };
  const openEditProperty = (property: Property) => { setEditingProperty(property); setIsPostPropertyModalOpen(true); };
  const closePostProperty = () => { setIsPostPropertyModalOpen(false); setEditingProperty(null); };
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
    if (location.pathname === '/admin') {
      if (window.history.length > 1) window.history.back();
      else navigate('/', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  const openPropertyDetail = (prop: Property) => {
    navigate(`/property/${getPropertySlug(prop)}`);
  };
  const closePropertyDetail = () => {
    setIsDetailModalOpen(false);
    setActiveProperty(null);
    if (location.pathname.startsWith('/property/')) navigate('/properties');
  };
  const openVirtualTour = (prop: Property) => { setVirtualTourProperty(prop); setIsVirtualTourOpen(true); };

  const goToPropertiesPage = () => {
    if (location.pathname === '/properties') {
      scrollToId('properties');
    } else {
      navigate('/properties');
    }
  };

  const forwardProperty = async (property: Property) => {
    const url = `${window.location.origin}/property/${getPropertySlug(property)}`;
    const landShare = property.landUnits
      ? `${property.landUnits.grounds ?? 0} Ground (${property.landUnits.cents ?? 0} Cents)`
      : '';
    const lines = [
      property.title,
      `Category: ${property.category}`,
      `Type: ${property.type === 'plot' ? 'Land / Plot' : 'Flat / Apartment'}`,
      ...(property.bhk ? [`Configuration: ${property.bhk}`] : []),
      `Location: ${property.locality}, ${property.zone}`,
      `Address: ${property.address}`,
      `Price: ${property.priceDisplay} (${property.pricePerUnit})`,
      `Area: ${property.areaSqFt.toLocaleString('en-IN')} sq.ft${landShare ? ` | ${landShare}` : ''}`,
      ...(property.uds ? [`UDS: ${property.uds} sq.ft`] : []),
      `Facing: ${property.facing}`,
      `Approval: ${property.approval}${property.reraNumber ? ` | RERA: ${property.reraNumber}` : ''}`,
      `Patta Status: ${property.pattaStatus}`,
      `Road Width: ${property.roadWidth}`,
      `Water Source: ${property.waterSource}`,
      `Possession: ${property.possession}`,
      ...(property.highlights && property.highlights.length ? [`Highlights: ${property.highlights.join('; ')}`] : []),
      ...(property.amenities && property.amenities.length ? [`Amenities: ${property.amenities.join(', ')}`] : []),
      `website: ${url}`,
    ];
    const text = lines.join('\n');
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: property.title, text });
        return;
      } catch {
        // User cancelled or share failed; no fallback needed.
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      window.alert('Property details copied. You can share them with anyone.');
    } catch {
      openPropertyWhatsApp(property);
    }
  };

  const applyQuickFilter = (id: 'all' | 'plots' | 'flats' | 'omr' | 'ecr' | 'budget') => {
    setQuickFilter(id);
    const params = new URLSearchParams();
    if (id !== 'all') params.set('quick', id);
    navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const goToPropertiesSearch = () => {
    setShowLocationSuggestions(false);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('location', toUrlSlug(searchQuery.trim()));
    if (selectedBudget !== 'all') params.set('budget', selectedBudget);
    if (selectedZone !== 'all') params.set('zone', selectedZone);
    if (selectedApproval !== 'all') params.set('approval', selectedApproval);
    if (quickFilter !== 'all') params.set('quick', quickFilter);
    navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      if (quickFilter === 'plots' && item.type !== 'plot') return false;
      if (quickFilter === 'flats' && item.type !== 'flat') return false;
      if (quickFilter === 'omr' && item.zone !== 'OMR Corridor') return false;
      if (quickFilter === 'ecr' && item.zone !== 'ECR Coast') return false;
      if (quickFilter === 'budget' && item.price > 6000000) return false;
      if (selectedZone !== 'all' && item.zone !== selectedZone) return false;
      if (selectedApproval !== 'all' && !item.approval.includes(selectedApproval)) return false;
      if (selectedBudget !== 'all') {
        if (selectedBudget === 'under50' && item.price > 5000000) return false;
        if (selectedBudget === '50to100' && (item.price < 5000000 || item.price > 10000000)) return false;
        if (selectedBudget === '100to250' && (item.price < 10000000 || item.price > 25000000)) return false;
        if (selectedBudget === 'above250' && item.price < 25000000) return false;
      }
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
    setSearchQuery(''); setSelectedZone('all'); setSelectedBudget('all'); setSelectedApproval('all'); setQuickFilter('all');
    navigate('/properties');
  };

  const favoriteProperties = useMemo(() => properties.filter((p) => favorites.includes(p.id)), [properties, favorites]);

  const knownRoute = isKnownRoute(location.pathname);
  if (!knownRoute || propertyNotFound) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      <Navbar onOpenPostProperty={openPostProperty} onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)} onOpenAdminLogin={() => { if (location.pathname !== '/admin') navigate('/admin'); else if (!hasAdminSession()) setIsAdminLoginOpen(true); }} savedCount={favorites.length} />
        <main className="flex-1"><NotFound /></main>
        <Footer onOpenPostProperty={openPostProperty} />
        <WhatsAppFloat />
      </div>
    );
  }

  if (location.pathname.replace(/\/+$/, '') === '/admin' && isAdminAuthenticated) {
    return (
      <>
        <AdminDashboard properties={properties} onPostProperty={openPostProperty} onEditProperty={openEditProperty} onLogout={handleAdminLogout} onDeleteProperty={handleDeleteProperty} syncError={propertiesError} />
        <PostPropertyModal isOpen={isPostPropertyModalOpen} onClose={closePostProperty} onAddProperty={handleAddProperty} onUpdateProperty={handleUpdateProperty} editingProperty={editingProperty} />
        <WhatsAppFloat />
      </>
    );
  }

  const services = [
    { title: 'Buy a Property', desc: 'Explore a wide range of residential and commercial properties in Trichy.', img: '/src/assets/images/chennai_villa_plot_1794240292802.jpg' },
    { title: 'Rent a Property', desc: 'Find the perfect rental property for your lifestyle and budget.', img: '/src/assets/images/chennai_flat_interior_1794240293038.jpg' },
    { title: 'Sell Your Property', desc: 'Get the right visibility and connect with genuine buyers and tenants.', img: '/src/assets/images/chennai_hero_luxury_1794240290491.jpg' },
    { title: 'Construction Services', desc: 'Reliable construction services with quality workmanship from start to finish.', img: '/src/assets/images/chennai_omr_skyline_1794240293319.jpg' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      <Navbar onOpenPostProperty={openPostProperty} onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)} onOpenAdminLogin={() => { if (location.pathname !== '/admin') navigate('/admin'); else if (!hasAdminSession()) setIsAdminLoginOpen(true); }} savedCount={favorites.length} />

      <main className="flex-1">
        {isLoadingProperties && (
          <div className="border-b border-slate-200 bg-white px-4 py-6">
            <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-3 text-slate-600">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-amber-600 rounded-full animate-spin" aria-hidden="true" />
              <p className="text-sm font-medium">Loading properties…</p>
              <p className="text-xs text-slate-500">Please wait while we fetch the latest listings.</p>
            </div>
          </div>
        )}
        {!isLoadingProperties && propertiesError && (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-[11px] font-semibold text-amber-800">{propertiesError}</div>
        )}

        <section className="relative bg-white pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] text-balance">
                  Find Your Dream Property. Invest in Your Future.
                </h1>
                <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                  Discover premium properties and investment opportunities in prime locations.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button onClick={goToPropertiesPage} className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm">Explore Properties</button>
                  <button onClick={() => window.open('https://wa.me/916300409615', '_blank', 'noopener,noreferrer')} className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-all">Contact Us</button>
                </div>
              </div>
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                    <img src="/src/assets/images/main.logo.jpg" alt="Chennai Luxury Real Estate" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-white rounded-3xl shadow-xl border border-slate-200 p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
                <div className="lg:col-span-5 relative" ref={locationSearchRef}>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Locality or Landmark</label>
                  <div className="relative">
                    <GeoAlt className="w-4 h-4 text-amber-600 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setShowLocationSuggestions(true); }}
                      onFocus={() => setShowLocationSuggestions(true)}
                      placeholder="e.g. OMR, ECR, Anna Nagar, Velachery..."
                      className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-slate-50"
                    />
                  </div>
                  {showLocationSuggestions && filteredLocationSuggestions.length > 0 && (
                    <div className="absolute z-30 mt-1 w-full max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg py-1 show-scrollbar">
                      {filteredLocationSuggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { setSearchQuery(s); setShowLocationSuggestions(false); }}
                          className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-amber-50 hover:text-slate-900"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="lg:col-span-4">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Budget Range</label>
                  <select value={selectedBudget} onChange={(e) => setSelectedBudget(e.target.value)} aria-label="Budget Range" className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-slate-50">
                    <option value="all">Any Price</option>
                    <option value="under50">Under ₹50 Lakhs (Affordable Plots)</option>
                    <option value="50to100">₹50 Lakhs - ₹1.0 Crore</option>
                    <option value="100to250">₹1.0 Crore - ₹2.5 Crore</option>
                    <option value="above250">Above ₹2.5 Crore (Luxury & 1+ Ground)</option>
                  </select>
                </div>
                <div className="lg:col-span-3">
                  <button onClick={goToPropertiesSearch} className="w-full py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 whitespace-nowrap">
                    <Search className="w-3.5 h-3.5 text-amber-400" />
                    <span>Find Properties</span>
                  </button>
                </div>
              </div>
            </div>

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

        <section id="properties" className="max-w-7xl mx-auto px-4 sm:px-6 py-14 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="text-xs font-bold tracking-wider text-amber-700 uppercase mb-1">Curated Chennai Portfolio</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Trending Lands & Flats in Chennai</h2>
              <p className="text-sm text-slate-500 mt-1">Hand-picked CMDA & DTCP approved plots and high-UDS flats verified by Madras High Court advocates.</p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {([
                { label: 'All', id: 'all' },
                { label: 'Villa Plots', id: 'plots' },
                { label: 'Luxury Flats', id: 'flats' },
                { label: 'OMR IT', id: 'omr' },
                { label: 'ECR Beach', id: 'ecr' },
                { label: '< ₹60L', id: 'budget' },
              ] as const).map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => applyQuickFilter(pill.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${quickFilter === pill.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 mt-8 p-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3"><Search className="w-6 h-6" /></div>
              <h3 className="text-base font-bold text-slate-900">No properties matched your search</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Try widening your search keywords or reset filters to see all available Chennai plots and flats.</p>
              <button onClick={resetFilters} className="mt-4 px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors">Reset All Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {filteredProperties.map((property) => {
                const isFav = favorites.includes(property.id);
                return (
                  <div
                    key={property.id}
                    onClick={() => openPropertyDetail(property)}
                    className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group cursor-pointer"
                  >
                    <PropertyCardImage
                      property={property}
                      isFavorite={isFav}
                      onToggleFavorite={toggleFavorite}
                      onForward={forwardProperty}
                    />
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                          <span>{property.zone}</span><span aria-hidden="true">·</span><span>{property.facing} Facing</span><span aria-hidden="true">·</span>
                          <span className="text-emerald-700 font-medium">{property.approval}</span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900 hover:text-amber-700 transition-colors line-clamp-1">{property.title}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1 line-clamp-1"><GeoAlt className="w-3.5 h-3.5 text-amber-600 shrink-0" /><span>{property.locality}</span></div>
                        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[11px] text-slate-400 block">Extent Area</span>
                            <span className="font-bold text-slate-900 tabular-nums">{property.areaSqFt.toLocaleString('en-IN')} sq.ft</span>
                            {property.bhk && <span className="text-[10px] text-blue-700 block font-medium">{property.bhk}</span>}
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-400 block">Approach & Water</span>
                            <span className="font-semibold text-slate-800 line-clamp-1 text-[11px]">{property.roadWidth}</span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); openPropertyDetail(property); }} className="flex-1 py-2 px-3 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center whitespace-nowrap">View Details</button>
                        <button onClick={(e) => { e.stopPropagation(); openPropertyWhatsApp(property); }} title="Share on WhatsApp" aria-label="Share on WhatsApp" className="py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-1 whitespace-nowrap shadow-xs">
                          <ChatDots className="w-3.5 h-3.5" /><span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section id="our-services" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs font-bold tracking-wider text-amber-700 uppercase mb-1">Our Services</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Find Your Perfect Property</h2>
            <p className="text-sm text-slate-500 mt-2">Buy, rent, or sell properties in Trichy with trusted guidance and personalised support at every step.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc) => (
              <div key={svc.title} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col">
                <div className="aspect-16/10 bg-slate-100 overflow-hidden">
                  <img src={svc.img} alt={svc.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-base text-slate-900">{svc.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 flex-1">{svc.desc}</p>
                  <button onClick={goToPropertiesPage} className="mt-4 text-sm font-semibold text-amber-700 hover:text-amber-800 self-start transition-colors">Explore Properties →</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="bg-white border-y border-slate-200 py-16 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="text-xs font-bold tracking-wider text-amber-700 uppercase mb-1">Your Property Journey, Made Simple</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">How RJ Land Ventures Works</h2>
              <p className="text-sm text-slate-500 mt-2">Finding the right plot should be easy and stress-free. From exploring verified properties to completing the registration, we guide you at every step.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Search & Find Your Property', desc: 'Explore a range of residential plots and flats that match your needs. Filter properties by location, budget, plot size, and approval status to find the right option for you.' },
                { step: '02', title: 'Explore Before You Visit', desc: 'Get a closer look at your shortlisted property through virtual tours. Check the layout, road access, plot boundaries, and surroundings before planning a site visit.' },
                { step: '03', title: 'Get Legal Guidance on WhatsApp', desc: 'Have questions about a property? Simply share the property details with our team on WhatsApp. Get assistance with document checks, Patta details, and property-related legal guidance.' },
                { step: '04', title: 'Complete Your Registration with Confidence', desc: "Once you've made your decision, we'll guide you through the registration process. Get support with documentation, advocate verification, and Sub-Registrar formalities, with transparent pricing and no brokerage." },
              ].map((item) => (
                <div key={item.step} className="p-6 bg-slate-50 rounded-3xl border border-slate-200 relative">
                  <div className="text-3xl font-black text-amber-600/30 tabular-nums mb-3">{item.step}</div>
                  <h3 className="font-bold text-base text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold tracking-wider text-amber-700 uppercase mb-1">Customer Stories</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Trusted by 1,800+ Chennai Property Buyers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'K. Balasubramanian', role: 'Tech Lead at TCS, Siruseri', loc: 'Purchased 1 Ground Villa Plot in Siruseri', quote: 'We were looking for a villa plot in Siruseri but wanted to understand the layout and road access before visiting. The virtual tour helped us get a clear picture, and the team guided us through the property documents. The overall experience was smooth and hassle-free.' },
              { name: 'Meera & Arvind Raman', role: 'NRI Investors, Singapore', loc: 'Purchased Coastal Villa Land in Akkarai, ECR', quote: 'Since we live in Singapore, buying land in Chennai from abroad was a big decision for us. We wanted to be sure about the property documents and ownership details. The team helped us understand the verification process and made things much easier.' },
              { name: 'Dr. S. Jayakumar', role: 'Ramachandra Hospital, Porur', loc: 'Purchased 3 BHK Residence in Anna Nagar', quote: 'What I liked most was the clarity throughout the buying process. The team explained the property details, pricing, and UDS calculations without making things complicated. Everything was handled transparently, which gave us confidence in our decision.' },
            ].map((t, idx) => (
              <div key={idx} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">{[...Array(5)].map((_, i) => <StarFill key={i} className="w-4 h-4 text-amber-400" />)}</div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">"{t.quote}"</p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="font-bold text-xs text-slate-900">{t.name}</div>
                  <div className="text-[11px] text-slate-500">{t.role}</div>
                  <div className="text-[10px] text-amber-700 font-semibold mt-0.5">{t.loc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer onOpenPostProperty={openPostProperty} />

      <PropertyDetailModal property={activeProperty} isOpen={isDetailModalOpen} onClose={closePropertyDetail} isFavorite={activeProperty ? favorites.includes(activeProperty.id) : false} onToggleFavorite={toggleFavorite} />
      <VirtualTourModal property={virtualTourProperty} isOpen={isVirtualTourOpen} onClose={() => setIsVirtualTourOpen(false)} />
      <PostPropertyModal isOpen={isPostPropertyModalOpen} onClose={closePostProperty} onAddProperty={handleAddProperty} onUpdateProperty={handleUpdateProperty} editingProperty={editingProperty} />
      <LegalGuideModal isOpen={isLegalGuideModalOpen} onClose={() => setIsLegalGuideModalOpen(false)} />
      <SavedPropertiesDrawer isOpen={isSavedDrawerOpen} onClose={() => setIsSavedDrawerOpen(false)} favorites={favoriteProperties} onRemoveFavorite={toggleFavorite} onSelectProperty={openPropertyDetail} onClearAll={() => setFavorites([])} />
      <AdminLoginModal isOpen={isAdminLoginOpen} onClose={() => setIsAdminLoginOpen(false)} onLoginSuccess={handleAdminLogin} />
      <WhatsAppFloat />
    </div>
  );
}
