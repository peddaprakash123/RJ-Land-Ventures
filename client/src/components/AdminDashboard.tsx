import React, { useMemo } from 'react';
import { Property } from '../data/chennaiProperties';
import {
  PlusLg,
  BoxArrowRight,
  GeoAlt,
  Trash3,
  PencilSquare,
  BoxArrowUpRight,
  CheckCircle,
  XCircle,
} from 'react-bootstrap-icons';

interface AdminDashboardProps {
  properties: Property[];
  onPostProperty: () => void;
  onEditProperty: (property: Property) => void;
  onLogout: () => void;
  onDeleteProperty: (id: string) => void | Promise<void>;
  onToggleSold: (property: Property) => void | Promise<void>;
  syncError?: string;
}

const formatTotalValue = (value: number): string => {
  if (value === 0) return '₹0';
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  return `₹${(value / 100000).toFixed(1)} L`;
};

const getPostedDate = (propertyId: string): string => {
  const timestamp = Number(propertyId.replace('user-prop-', ''));
  if (!Number.isFinite(timestamp)) return '—';
  return new Date(timestamp).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  properties,
  onPostProperty,
  onEditProperty,
  onLogout,
  onDeleteProperty,
  onToggleSold,
  syncError,
}) => {
  // Only properties posted from this admin console are shown here.
  const postedProperties = useMemo(
    () => properties.filter((property) => property.id.startsWith('user-prop-')),
    [properties]
  );

  const plotCount = postedProperties.filter((property) => property.type === 'plot').length;
  const flatCount = postedProperties.filter((property) => property.type === 'flat').length;
  const totalValue = postedProperties.reduce((sum, property) => sum + property.price, 0);

  const handleDelete = (property: Property) => {
    const confirmed = window.confirm(
      `Remove "${property.title}" from the live listings? This cannot be undone.`
    );
    if (confirmed) onDeleteProperty(property.id);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-stone-950 text-stone-100 border-b border-stone-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-5 py-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex h-7 items-center justify-center rounded-sm bg-white px-1.5">
              <img
                src="/images/rj-land-ventures-mark.png?v=4"
                alt="RJ Land Ventures logo"
                width={354}
                height={301}
                className="h-5 w-auto"
              />
            </span>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold tracking-tight font-[family-name:var(--font-display)] leading-tight truncate">
                RJ Land Ventures <span className="text-amber-500">Console</span>
              </div>
              <div className="text-[10px] text-stone-400 leading-tight">Admin · active session</div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onPostProperty}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-sm transition-colors"
            >
            <PlusLg className="w-3.5 h-3.5" />
              <span>New listing</span>
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-stone-300 hover:text-white border border-stone-700 hover:border-stone-500 rounded-sm transition-colors"
            >
              <BoxArrowRight className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-5 py-4 space-y-4">
        {syncError && (
          <div
            role="alert"
            className="border-l-2 border-amber-600 bg-amber-50 px-3 py-2 text-[11px] font-medium leading-relaxed text-stone-800"
          >
            {syncError}
          </div>
        )}

        {/* Title + action */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-300 pb-3">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.14em] text-amber-700 uppercase mb-0.5">
              Inventory control
            </p>
            <h1 className="text-xl sm:text-2xl font-semibold text-stone-950 tracking-tight font-[family-name:var(--font-display)] leading-tight">
              Posted properties
            </h1>
            <p className="text-[12px] text-stone-600 mt-0.5 max-w-xl">
              Listings created from this console. Changes publish to the public site.
            </p>
          </div>
          <button
            onClick={onPostProperty}
            className="inline-flex sm:hidden items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-sm transition-colors self-start"
          >
            <PlusLg className="w-3.5 h-3.5" />
            <span>New listing</span>
          </button>
        </div>

        {/* Metrics strip */}
        <section aria-label="Summary metrics" className="border border-stone-300 bg-white">
          <dl className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
            <div className="px-3 py-2.5">
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-stone-500">Listings</dt>
              <dd className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-xl font-semibold text-stone-950 tabular-nums font-[family-name:var(--font-display)]">
                  {postedProperties.length}
                </span>
                <span className="text-[10px] text-stone-500">total</span>
              </dd>
            </div>
            <div className="px-3 py-2.5">
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-stone-500">Land / plots</dt>
              <dd className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-xl font-semibold text-stone-950 tabular-nums font-[family-name:var(--font-display)]">
                  {plotCount}
                </span>
                <span className="text-[10px] text-stone-500">
                  {postedProperties.length ? `${Math.round((plotCount / postedProperties.length) * 100)}%` : '—'}
                </span>
              </dd>
            </div>
            <div className="px-3 py-2.5">
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-stone-500">Flats</dt>
              <dd className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-xl font-semibold text-stone-950 tabular-nums font-[family-name:var(--font-display)]">
                  {flatCount}
                </span>
                <span className="text-[10px] text-stone-500">
                  {postedProperties.length ? `${Math.round((flatCount / postedProperties.length) * 100)}%` : '—'}
                </span>
              </dd>
            </div>
            <div className="px-3 py-2.5 bg-stone-50">
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-stone-500">Portfolio value</dt>
              <dd className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-xl font-semibold text-stone-950 tabular-nums font-[family-name:var(--font-display)]">
                  {formatTotalValue(totalValue)}
                </span>
                <span className="text-[10px] text-amber-700 font-medium">aggregate</span>
              </dd>
            </div>
          </dl>
        </section>

        {/* Listings ledger */}
        <section className="border border-stone-300 bg-white">
          <div className="px-3 py-2 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-stone-50">
            <div className="flex items-baseline gap-2 min-w-0">
              <h2 className="text-[12px] font-semibold text-stone-900 uppercase tracking-wide font-[family-name:var(--font-display)]">
                Listing ledger
              </h2>
              <span className="text-[10px] text-stone-500 tabular-nums">
                {postedProperties.length} record{postedProperties.length === 1 ? '' : 's'}
              </span>
            </div>
            {postedProperties.length > 0 && (
              <button
                onClick={onPostProperty}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-900 underline decoration-amber-300 underline-offset-2 self-start sm:self-auto"
              >
                <PlusLg className="w-3 h-3" />
                Add property
              </button>
            )}
          </div>

          {postedProperties.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-medium text-stone-900 font-[family-name:var(--font-display)]">
                No posted properties
              </p>
              <p className="text-[12px] text-stone-600 mt-1 max-w-sm mx-auto leading-relaxed">
                Post a Chennai land or flat to create the first record. It will appear here and on the public site.
              </p>
              <button
                onClick={onPostProperty}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-sm transition-colors"
              >
              <PlusLg className="w-3.5 h-3.5" />
                Post property
              </button>
            </div>
          ) : (
            <>
              {/* column header */}
              <div className="hidden md:grid grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.7fr)_auto] gap-x-3 px-3 py-1.5 border-b border-stone-200 text-[9px] font-semibold uppercase tracking-wider text-stone-500 bg-white">
                <div>Property</div>
                <div>Location / zone</div>
                <div className="text-right">Price</div>
                <div>Specs</div>
                <div>Posted</div>
                <div className="text-right">Actions</div>
              </div>

              <ul className="divide-y divide-stone-200">
                {postedProperties.map((property) => {
                  const specA = `${property.areaSqFt.toLocaleString('en-IN')} sq.ft`;
                  const specB =
                    property.type === 'plot'
                      ? `${property.landUnits?.grounds ?? '—'} ground · ${property.facing}`
                      : `${property.bhk || '—'}${property.bathrooms ? ` · ${property.bathrooms} bath` : ''} · UDS ${property.uds ?? '—'}`;

                  return (
                    <li key={property.id} className="hover:bg-stone-50/70 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.7fr)_auto] gap-x-3 gap-y-1.5 px-3 py-2.5 items-start">
                        {/* Property */}
                        <div className="flex gap-2.5 min-w-0">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-14 h-14 md:w-16 md:h-16 object-cover shrink-0 border border-stone-200 bg-stone-100"
                          />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mb-0.5 text-[10px] text-stone-500">
                              <span className="font-semibold uppercase tracking-wide text-amber-700">
                                {property.type === 'plot' ? 'Plot' : 'Flat'}
                              </span>
                              <span className="text-stone-300">|</span>
                              <span className="truncate">{property.approval}</span>
                              <span className="text-stone-300">|</span>
                              <span className={property.showDetailsInView === false ? 'text-stone-500' : 'text-stone-700'}>
                                {property.showDetailsInView === false ? 'details private' : 'details public'}
                              </span>
                              {property.isSold && (
                                <>
                                  <span className="text-stone-300">|</span>
                                  <span className="font-semibold text-red-700">Sold</span>
                                </>
                              )}
                              {property.type === 'flat' && property.propertyStatus && !property.isSold && (
                                <>
                                  <span className="text-stone-300">|</span>
                                  <span className="text-stone-700">{property.propertyStatus}</span>
                                </>
                              )}
                            </div>
                            <h3 className="text-[13px] font-semibold text-stone-950 leading-snug line-clamp-2 font-[family-name:var(--font-display)]">
                              {property.title}
                            </h3>
                            <div className="md:hidden mt-1 text-[11px] text-stone-600 flex items-center gap-1">
                              <GeoAlt className="w-3 h-3 text-amber-700 shrink-0" />
                              <span className="truncate">{property.locality} · {property.zone}</span>
                            </div>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="hidden md:block min-w-0 text-[11px]">
                          <div className="text-stone-900 font-medium truncate">{property.locality}</div>
                          <div className="text-stone-500 truncate">{property.zone}</div>
                          {property.googleMapsUrl ? (
                            <a
                              href={property.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 mt-0.5 text-[10px] font-medium text-amber-800 hover:text-amber-900"
                            >
                              Map <BoxArrowUpRight className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            <span className="block mt-0.5 text-[10px] text-stone-400">No map pin</span>
                          )}
                        </div>

                        {/* Price */}
                        <div className="text-[11px] md:text-right">
                          <div className="text-[13px] font-semibold text-stone-950 tabular-nums font-[family-name:var(--font-display)]">
                            {property.priceDisplay}
                          </div>
                          <div className="text-[10px] text-stone-500 tabular-nums">{property.pricePerUnit}</div>
                        </div>

                        {/* Specs */}
                        <div className="text-[11px] text-stone-700 min-w-0">
                          <div className="tabular-nums">{specA}</div>
                          <div className="text-stone-500 truncate" title={specB}>{specB}</div>
                        </div>

                        {/* Posted */}
                        <div className="text-[11px] text-stone-600 tabular-nums">
                          <span className="md:hidden text-stone-400 mr-1">Posted</span>
                          {getPostedDate(property.id)}
                        </div>

                        {/* Actions */}
                        <div className="flex md:flex-col items-center md:items-end gap-1.5 md:gap-1 pt-0.5">
                          {property.googleMapsUrl && (
                            <a
                              href={property.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="md:hidden inline-flex items-center gap-1 text-[10px] font-medium text-amber-800"
                            >
                              <GeoAlt className="w-3 h-3" /> Map
                            </a>
                          )}
                          <button
                            onClick={() => onToggleSold(property)}
                            className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold border rounded-sm transition-colors ${
                              property.isSold
                                ? 'text-emerald-700 border-emerald-300 hover:border-emerald-500 hover:text-emerald-800 bg-white'
                                : 'text-red-700 border-red-300 hover:border-red-500 hover:text-red-800 bg-white'
                            }`}
                            title={property.isSold ? 'Mark as available' : 'Mark as sold'}
                          >
                            {property.isSold ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                            <span>{property.isSold ? 'Available' : 'Sold'}</span>
                          </button>
                          <button
                            onClick={() => onEditProperty(property)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-stone-800 border border-stone-300 hover:border-amber-600 hover:text-amber-800 bg-white rounded-sm transition-colors"
                          >
                            <PencilSquare className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(property)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-stone-700 border border-stone-300 hover:border-stone-500 hover:text-stone-950 bg-white rounded-sm transition-colors"
                          >
                            <Trash3 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </section>

        <p className="text-[10px] text-stone-500 text-center pb-1">
          Session active · logout returns to the public site.
        </p>
      </main>

      <footer className="border-t border-stone-300 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-5 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] text-stone-500">
          <span>© {new Date().getFullYear()} RJ Land Ventures · Admin console</span>
          <span className="text-stone-600">Protected area</span>
        </div>
      </footer>
    </div>
  );
};

