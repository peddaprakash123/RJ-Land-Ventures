import React, { useEffect, useRef, useState } from 'react';
import { Property } from '../data/chennaiProperties';
import { uploadPropertyImage, type UploadedImage } from '../api/properties';
import {
  XLg,
  PlusCircle,
  CheckCircle,
  CloudUpload,
  GeoAlt,
  Building,
  CurrencyRupee,
  Camera,
  Trash3,
  BoxArrowUpRight,
  CheckLg,
  Calendar3,
  Clock,
  ShieldCheck,
  Layers,
  CarFront,
  Tv,
  ArrowRight,
  PencilSquare,
  Eye,
  Lock,
  ArrowRepeat
} from 'react-bootstrap-icons';

interface PostPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (newProp: Property) => Promise<void> | void;
  onUpdateProperty: (updatedProp: Property) => Promise<void> | void;
  editingProperty?: Property | null;
}

export const PostPropertyModal: React.FC<PostPropertyModalProps> = ({
  isOpen,
  onClose,
  onAddProperty,
  onUpdateProperty,
  editingProperty = null,
}) => {
  const isEditing = Boolean(editingProperty);
  const [propertyType, setPropertyType] = useState<'plot' | 'flat'>('plot');
  const [title, setTitle] = useState('');
  const [locality, setLocality] = useState('');
  const [zone, setZone] = useState<string>('OMR Corridor');
  const [address, setAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [priceInLakhs, setPriceInLakhs] = useState<number>(45);
  const [areaSqFt, setAreaSqFt] = useState<number>(1200);
  const [facing, setFacing] = useState<Property['facing']>('East');
  const [approval, setApproval] = useState<Property['approval']>('CMDA Approved');
  const [waterSource, setWaterSource] = useState('Sweet Groundwater at 25 ft');
  const [roadWidth, setRoadWidth] = useState('30 Feet Road');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [description, setDescription] = useState('');
  const [showDetailsInView, setShowDetailsInView] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState('');
  // Invalidates in-flight uploads when the modal closes or switches listings.
  const uploadTokenRef = useRef(0);

  // Property category/highlight label shown on card image
  const [propertyCategory, setPropertyCategory] = useState<string>('Premium Villa Plots');

  const propertyCategoryOptions = [
    'Gated Villa Communities',
    'Premium Villa Plots',
    'Beachside Luxury',
    'Luxury Residences',
    'Residential Plots',
    'Skyline Apartments',
    'Boutique Residences',
    'Premium Penthouses',
    'Luxury Duplex Homes',
    'Waterfront Villas',
    'Independent Houses',
    'Premium Farm Plots',
    'Smart City Apartments',
    'Luxury Row Houses',
    'Garden Villas',
    'Integrated Township Plots',
  ];

  // Benefits (manually added tags shown on property cards)
  const [benefits, setBenefits] = useState<string[]>([]);
  const [benefitInput, setBenefitInput] = useState('');

  // Photos State
  const [photos, setPhotos] = useState<string[]>([
    '/src/assets/images/chennai_villa_plot_1794240292802.jpg',
  ]);

  // Land & Plot Specific Fields
  const [landType, setLandType] = useState<string>('CMDA Gated Community Plot');
  const [totalPlots, setTotalPlots] = useState<string>('');
  const [plotSizes, setPlotSizes] = useState<string[]>([]);
  const [plotSizeInput, setPlotSizeInput] = useState<string>('');
  const [plotUds, setPlotUds] = useState<string>('');
  const [plotUdsTouched, setPlotUdsTouched] = useState<boolean>(false);
  const [carParking, setCarParking] = useState<string>('Dedicated Covered Parking');
  const [liftAccess, setLiftAccess] = useState<boolean>(false);
  const [cctvAccess, setCctvAccess] = useState<boolean>(true);

  // Flat & Apartment Specific Fields
  const [bhk, setBhk] = useState('3 BHK');
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [propertyStatus, setPropertyStatus] = useState<'For Sale' | 'For Rent'>('For Sale');
  const [monthlyRent, setMonthlyRent] = useState<number>(25000);
  const [buildingAge, setBuildingAge] = useState<string>('Brand New (Under 1 Year)');
  const [floorNumber, setFloorNumber] = useState<string>('3rd Floor of 8 Floors');
  const [underConstruction, setUnderConstruction] = useState<boolean>(false);
  const [handoverDate, setHandoverDate] = useState<string>('2026-12-15');
  const [flatUds, setFlatUds] = useState<string>('');
  const [flatUdsTouched, setFlatUdsTouched] = useState<boolean>(false);

  const isFlatRent = propertyType === 'flat' && propertyStatus === 'For Rent';

  // Populate the form whenever the modal opens — blank for a new listing,
  // or pre-filled with the selected property's details for editing.
  useEffect(() => {
    if (!isOpen) return;

    setIsSuccess(false);
    setIsSubmitting(false);
    setSubmitError('');
    setIsUploadingPhotos(false);
    setPhotoUploadError('');
    uploadTokenRef.current += 1;

    if (!editingProperty) {
      setPropertyType('plot');
      setPropertyCategory('Premium Villa Plots');
      setTitle('');
      setLocality('');
      setZone('OMR Corridor');
      setAddress('');
      setGoogleMapsUrl('');
      setPriceInLakhs(45);
      setAreaSqFt(1200);
      setFacing('East');
      setApproval('CMDA Approved');
      setWaterSource('Sweet Groundwater at 25 ft');
      setRoadWidth('30 Feet Road');
      setSellerName('');
      setSellerPhone('');
      setDescription('');
      setShowDetailsInView(true);
      setBenefits([]);
      setBenefitInput('');
      setPhotos(['/src/assets/images/chennai_villa_plot_1794240292802.jpg']);
      setLandType('CMDA Gated Community Plot');
      setTotalPlots('');
      setPlotSizes([]);
      setPlotSizeInput('');
      setPlotUds('');
      setPlotUdsTouched(false);
      setCarParking('Dedicated Covered Parking');
      setLiftAccess(false);
      setCctvAccess(true);
      setBhk('3 BHK');
      setBedrooms(3);
      setBathrooms(2);
      setPropertyStatus('For Sale');
      setMonthlyRent(25000);
      setBuildingAge('Brand New (Under 1 Year)');
      setFloorNumber('3rd Floor of 8 Floors');
      setUnderConstruction(false);
      setHandoverDate('2026-12-15');
      setFlatUds('');
      setFlatUdsTouched(false);
      return;
    }

    const property = editingProperty;
    setPropertyType(property.type);
    setPropertyCategory(property.category || (property.type === 'plot' ? 'Premium Villa Plots' : 'Luxury Residences'));
    setTitle(property.title);
    setLocality(property.locality);
    setZone(property.zone);
    setAddress(property.address);
    setGoogleMapsUrl(property.googleMapsUrl || '');
    setPriceInLakhs(+(property.price / 100000).toFixed(2));
    setAreaSqFt(property.areaSqFt);
    setFacing(property.facing);
    setApproval(property.approval);
    setWaterSource(property.waterSource || 'Sweet Groundwater at 25 ft');
    setRoadWidth(property.roadWidth || '30 Feet Road');
    setSellerName(property.sellerName || '');
    setSellerPhone(property.sellerPhone || '');
    setDescription(property.description || '');
    setShowDetailsInView(property.showDetailsInView !== false);
    setBenefits(property.benefits ?? []);
    setBenefitInput('');
    setPhotos(
      property.gallery && property.gallery.length > 0 ? property.gallery : [property.image]
    );
    setLandType(property.landType || 'CMDA Gated Community Plot');
    setTotalPlots(property.totalPlots || '');
    setPlotSizes(property.plotSizes ?? []);
    setPlotSizeInput('');
    setPlotUds(property.uds !== undefined && property.uds !== null ? String(property.uds) : '');
    setPlotUdsTouched(property.uds !== undefined && property.uds !== null);
    setCarParking(property.carParking || 'Dedicated Covered Parking');
    setLiftAccess(property.liftAccess ?? false);
    setCctvAccess(property.cctvAccess ?? true);
    setBhk(property.bhk || '3 BHK');
    setBedrooms(
      property.bedrooms ??
        Math.max(1, parseInt(property.bhk || '3', 10) || 3)
    );
    setBathrooms(property.bathrooms ?? 2);
    setPropertyStatus(property.propertyStatus ?? 'For Sale');
    setMonthlyRent(
      property.propertyStatus === 'For Rent' ? property.price : 25000
    );
    setBuildingAge(property.buildingAge || 'Brand New (Under 1 Year)');
    setFloorNumber(property.floorNumber || '3rd Floor of 8 Floors');
    setUnderConstruction(property.underConstruction ?? false);
    setHandoverDate(property.handoverDate || '2026-12-15');
    setFlatUds(property.uds !== undefined && property.uds !== null ? String(property.uds) : '');
    setFlatUdsTouched(property.uds !== undefined && property.uds !== null);
  }, [isOpen, editingProperty]);

  if (!isOpen) return null;

  // Upload photos to Cloudinary through the API and keep the permanent URLs.
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const filesArray = Array.from(input.files || []);
    input.value = '';

    if (filesArray.length === 0) return;

    const token = uploadTokenRef.current;
    setIsUploadingPhotos(true);
    setPhotoUploadError('');

    const results = await Promise.allSettled(
      filesArray.map((file) => uploadPropertyImage(file))
    );

    // The modal was closed or another listing was opened while uploading.
    if (token !== uploadTokenRef.current) return;

    const uploadedUrls = results
      .filter(
        (result): result is PromiseFulfilledResult<UploadedImage> =>
          result.status === 'fulfilled'
      )
      .map((result) => result.value.url);

    const failures = results
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .map((result) =>
        result.reason instanceof Error ? result.reason.message : 'Upload failed.'
      );

    if (uploadedUrls.length > 0) {
      setPhotos((prev) => [...prev, ...uploadedUrls]);
    }
    if (failures.length > 0) {
      setPhotoUploadError(failures.join(' '));
    }

    setIsUploadingPhotos(false);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const addBenefit = () => {
    const value = benefitInput.trim();
    if (!value) return;
    setBenefits((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setBenefitInput('');
  };

  const removeBenefit = (index: number) => {
    setBenefits((prev) => prev.filter((_, i) => i !== index));
  };

  const parsePlotSizeValue = (value: string) => {
    const n = parseFloat(value.replace(/[^\d.]/g, ''));
    return Number.isFinite(n) ? n : 0;
  };

  const addPlotSize = () => {
    const value = plotSizeInput.trim();
    if (!value) return;
    const next = [...plotSizes, value];
    setPlotSizes(next);
    setPlotSizeInput('');
    const sum = next.reduce((acc, item) => acc + parsePlotSizeValue(item), 0);
    if (sum > 0) setAreaSqFt(sum);
  };

  const removePlotSize = (index: number) => {
    const next = plotSizes.filter((_, i) => i !== index);
    setPlotSizes(next);
    const sum = next.reduce((acc, item) => acc + parsePlotSizeValue(item), 0);
    if (sum > 0) setAreaSqFt(sum);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedAddress = address.trim();
    const derivedLocality = trimmedAddress.split(',')[0]?.trim() || locality.trim() || trimmedAddress;
    if (!title || !trimmedAddress) return;
    if (!isEditing && !sellerPhone) return;
    if (isSubmitting || isUploadingPhotos) return;

    setIsSubmitting(true);
    setSubmitError('');

    const priceINR = isFlatRent ? monthlyRent : priceInLakhs * 100000;
    const priceDisplay = isFlatRent
      ? `₹${monthlyRent.toLocaleString('en-IN')} / month`
      : priceINR >= 10000000
        ? `₹${(priceINR / 10000000).toFixed(2)} Cr`
        : `₹${(priceINR / 100000).toFixed(1)} Lakhs`;

    const pricePerUnit = isFlatRent
      ? `₹${Math.round(monthlyRent / areaSqFt).toLocaleString('en-IN')} / sq.ft / month`
      : `₹${Math.round(priceINR / areaSqFt).toLocaleString('en-IN')} / sq.ft`;

    const defaultCover =
      propertyType === 'plot'
        ? '/src/assets/images/chennai_villa_plot_1794240292802.jpg'
        : '/src/assets/images/chennai_flat_interior_1794240293038.jpg';

    const chosenPhotos = photos.length > 0 ? photos : [defaultCover];

    const newProperty: Property = {
      id: editingProperty ? editingProperty.id : `user-prop-${Date.now()}`,
      title,
      type: propertyType,
      category: propertyCategory,
      locality: derivedLocality,
      zone,
      address: trimmedAddress,
      price: priceINR,
      priceDisplay,
      pricePerUnit,
      areaSqFt,
      landUnits: propertyType === 'plot' ? {
        grounds: +(areaSqFt / 2400).toFixed(2),
        cents: +(areaSqFt / 435.6).toFixed(2),
      } : undefined,
      bhk: propertyType === 'flat' ? bhk : undefined,
      bedrooms: propertyType === 'flat' ? bedrooms : undefined,
      bathrooms: propertyType === 'flat' ? bathrooms : undefined,
      propertyStatus: propertyType === 'flat' ? propertyStatus : undefined,
      facing,
      approval,
      pattaStatus: 'Clear Patta Ready',
      image: chosenPhotos[0],
      gallery: chosenPhotos,
      description:
        description ||
        `Direct owner listed ${
          propertyType === 'plot'
            ? landType
            : `${bhk} flat${isFlatRent ? ' for rent' : ''}`
        } located in ${trimmedAddress}, Chennai. Verified clear title, compliant with CMDA/DTCP standards and ready for quick ${
          isFlatRent ? 'occupation' : 'registration'
        }.`,
      highlights: [
        `Direct Verified Listing by ${sellerName || 'Owner'}`,
        `${areaSqFt} sq.ft with 100% Vastu ${facing} Entrance`,
        `${approval} with verified legal track`,
        propertyType === 'plot'
          ? `Land Type: ${landType} · Parking: ${carParking}`
          : `${propertyStatus} · ${bedrooms} Bedrooms · ${bathrooms} Bathrooms · ${underConstruction ? 'Under Construction' : 'Ready to Move'}`,
      ],
      benefits,
      amenities: propertyType === 'plot'
        ? [
            'Clear Computerized Patta',
            `Car Parking: ${carParking}`,
            `Water Source: ${waterSource}`,
            `Road Frontage: ${roadWidth}`,
          ]
        : [
            'Clear Computerized Patta',
            `Car Parking: ${carParking}`,
            `Lift Access: ${liftAccess ? 'Available' : 'No Lift'}`,
            `CCTV Surveillance: ${cctvAccess ? 'Installed' : 'Not Available'}`,
            `Water Source: ${waterSource}`,
            `Road Frontage: ${roadWidth}`,
          ],
      nearbyLandmarks: [
        { name: derivedLocality, distance: 'Immediate' },
        { name: 'Nearest Chennai Metro / Bus Junction', distance: '1.2 km' },
      ],
      possession: propertyType === 'plot'
        ? 'Immediate Registration'
        : isFlatRent
          ? 'Ready to Move'
          : (underConstruction ? `Under Construction (Handover ${handoverDate})` as any : 'Ready to Move'),
      isVerified: true,
      uds: (() => {
        const raw = propertyType === 'plot' ? plotUds : flatUds;
        const touched = propertyType === 'plot' ? plotUdsTouched : flatUdsTouched;
        const n = parseFloat(raw);
        return touched && Number.isFinite(n) && n > 0 ? n : undefined;
      })(),
      waterSource,
      roadWidth,
      googleMapsUrl: googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmedAddress + ', Chennai')}`,
      landType: propertyType === 'plot' ? (landType.trim() || undefined) : undefined,
      totalPlots: propertyType === 'plot' ? (totalPlots.trim() || undefined) : undefined,
      plotSizes: propertyType === 'plot' && plotSizes.length > 0 ? plotSizes : undefined,
      carParking: propertyType === 'plot' ? undefined : carParking,
      liftAccess: propertyType === 'plot' ? undefined : liftAccess,
      cctvAccess: propertyType === 'plot' ? undefined : cctvAccess,
      buildingAge: propertyType === 'flat' ? buildingAge : undefined,
      floorNumber: propertyType === 'flat' ? floorNumber : undefined,
      underConstruction: propertyType === 'flat' ? underConstruction : undefined,
      handoverDate: propertyType === 'flat' && underConstruction ? handoverDate : undefined,
      sellerName: sellerName || undefined,
      sellerPhone: sellerPhone || undefined,
      showDetailsInView,
      isSold: editingProperty?.isSold,
    };

    try {
      if (editingProperty) {
        await onUpdateProperty(newProperty);
      } else {
        await onAddProperty(newProperty);
      }
      setIsSuccess(true);
    } catch (error) {
      console.error('Failed to save property:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Could not save the property. Check the API connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain no-scrollbar bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              {isEditing ? <PencilSquare className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold">
                {isEditing ? 'Edit Property Details' : 'List Your Chennai Land or Flat for Sale'}
              </h3>
              <p className="text-xs text-slate-300">
                {isEditing
                  ? 'Update the listing details below and save your changes'
                  : 'Direct seller posting with verified Google Maps location & instant listing'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close post property modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <XLg className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">
              {isEditing ? 'Property Updated Successfully!' : 'Property Published Successfully!'}
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {isEditing ? (
                <>
                  Your changes to <strong>"{title}"</strong> at <strong>{address || locality}</strong> have
                  been saved in the RJ Land Ventures listing catalog.
                </>
              ) : (
                <>
                  Your property <strong>"{title}"</strong> at <strong>{address || locality}</strong> is now
                  live with photos, specifications, and location details on the RJ Land Ventures
                  Chennai listings.
                </>
              )}
            </p>
            <button
              onClick={handleDone}
              className="py-2.5 px-6 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
            >
              {isEditing ? 'Back to Admin Panel' : 'View in Live Listings'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 max-h-[78vh] overflow-y-auto overscroll-contain no-scrollbar space-y-6">
            {/* Property Type Segmented Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Property Category *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setPropertyType('plot');
                    if (photos.length === 0 || photos[0].includes('interior')) {
                      setPhotos(['/src/assets/images/chennai_villa_plot_1794240292802.jpg']);
                    }
                  }}
                  className={`px-3 py-2.5 text-xs font-bold rounded-lg transition-all leading-tight ${
                    propertyType === 'plot'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Land & Plot (Grounds / Cents)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPropertyType('flat');
                    if (photos.length === 0 || photos[0].includes('villa_plot')) {
                      setPhotos(['/src/assets/images/chennai_flat_interior_1794240293038.jpg']);
                    }
                  }}
                  className={`px-3 py-2.5 text-xs font-bold rounded-lg transition-all leading-tight ${
                    propertyType === 'flat'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Flat & Apartment
                </button>
              </div>

              {/* About this Property — shared input for Land/Plot and Flat/Apartment */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="about-property"
                    className="block text-[11px] font-bold text-slate-700"
                  >
                    About this Property ({propertyType === 'plot' ? 'Land / Plot' : 'Flat / Apartment'})
                  </label>
                  <span className="text-[10px] font-medium text-slate-400 tabular-nums">
                    {description.length}/1200
                  </span>
                </div>
                <textarea
                  id="about-property"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  maxLength={1200}
                  placeholder={
                    propertyType === 'plot'
                      ? 'Describe the land — survey/plot number, road frontage, water source, approvals, nearby landmarks...'
                      : 'Describe the flat — BHK layout, floor, facing, amenities, parking, handover timeline...'
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none resize-y leading-relaxed"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Shown as “About this Property” in the public View Details card
                  {showDetailsInView ? '.' : ' — currently hidden because details are set to private.'}
                </p>
              </div>
            </div>

            {/* STARTING ADD PHOTOS OPTION (Requested by user) */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <Camera className="w-4 h-4 text-amber-600" />
                    2. Add Property Photos ({photos.length}) *
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Upload plot layout photos, avenue road views, or apartment interior images.
                    Files are stored securely on Cloudinary.
                  </p>
                </div>

                <label
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg transition-colors shadow-xs ${
                    isUploadingPhotos
                      ? 'cursor-wait opacity-60'
                      : 'cursor-pointer hover:bg-slate-100'
                  }`}
                >
                  {isUploadingPhotos ? (
                    <ArrowRepeat className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  ) : (
                    <CloudUpload className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  <span>{isUploadingPhotos ? 'Uploading…' : 'Upload Files'}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={isUploadingPhotos}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">
                  Property Highlight Name (shown on card image top-left)
                </label>
                <div className="flex flex-wrap gap-2">
                  {propertyCategoryOptions.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setPropertyCategory(name)}
                      className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border transition-colors ${
                        propertyCategory === name
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-amber-500 hover:text-slate-900'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Thumbnails Strip */}
              {photos.length > 0 && (
                <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 pt-1">
                  {photos.map((photoUrl, idx) => (
                    <div key={idx} className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-300 group">
                      <img src={photoUrl} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[9px] text-amber-300 font-bold text-center py-0.5">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors"
                        title="Remove photo"
                      >
                        <Trash3 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {photoUploadError && (
                <div
                  role="alert"
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-semibold leading-relaxed text-rose-700"
                >
                  {photoUploadError}
                </div>
              )}

            </div>

            {/* LOCATION DETAILS */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <GeoAlt className="w-4 h-4 text-emerald-600" />
                3. Location Details *
              </span>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Property Address *
                </label>
                <textarea
                  required
                  value={address}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAddress(val);
                    const first = val.split(',')[0]?.trim();
                    setLocality(first || val);
                  }}
                  placeholder="Enter full property address (door/plot no, street, area, pincode)..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Chennai Zone / Location
                  </label>
                  <input
                    type="text"
                    list="chennai-zone-options"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder="Select or type a new location/zone"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-white"
                  />
                  <datalist id="chennai-zone-options">
                    <option value="OMR Corridor" />
                    <option value="ECR Coast" />
                    <option value="Central Chennai" />
                    <option value="South Chennai" />
                    <option value="West Chennai" />
                    <option value="GST & Suburbs" />
                  </datalist>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Choose a suggestion or type a new Chennai location/zone.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      Google Maps Pin / Coordinates Link
                    </label>
                    {googleMapsUrl && (
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        Open Map <BoxArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="url"
                    value={googleMapsUrl}
                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    placeholder="https://maps.google.com/... or coordinates link"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-white font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* TITLE & BASIC DETAILS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Property Title / Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={propertyType === 'plot' ? 'e.g. Marina Breeze Gated Villa Plots' : 'e.g. 3 BHK Luxury Sky Residence'}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFlatRent ? 'Monthly Rent (₹) *' : 'Total Asking Price (in Lakhs) *'}
                </label>
                {isFlatRent ? (
                  <div className="relative">
                    <input
                      type="number"
                      required
                      step="500"
                      min="1000"
                      max="1000000"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none tabular-nums"
                    />
                    <span className="absolute right-3 top-2 text-xs font-bold text-blue-700 tabular-nums">
                      ₹{monthlyRent.toLocaleString('en-IN')} / month
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="number"
                      required
                      step="any"
                      min="5"
                      max="5000"
                      value={priceInLakhs}
                      onChange={(e) => setPriceInLakhs(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none tabular-nums"
                    />
                    <span className="absolute right-3 top-2 text-xs font-bold text-slate-700 tabular-nums">
                      {priceInLakhs >= 100 ? `₹${(priceInLakhs / 100).toFixed(2)} Cr` : `₹${priceInLakhs} L`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CONDITIONAL SECTION: LAND & PLOT SPECIFIC INPUTS */}
            {propertyType === 'plot' && (
              <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-amber-700" />
                  Land & Plot Specifications
                </div>

                <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Land Type *
                      </label>
                      <input
                        type="text"
                        required
                        value={landType}
                        onChange={(e) => setLandType(e.target.value)}
                        placeholder="e.g. Residential Villa Plot"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Total Plots
                      </label>
                      <input
                        type="text"
                        value={totalPlots}
                        onChange={(e) => setTotalPlots(e.target.value)}
                        placeholder="e.g. 20"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-white tabular-nums"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Total Sq.Ft *
                      </label>
                      <input
                        type="text"
                        required
                        inputMode="numeric"
                        value={areaSqFt === 0 ? '' : areaSqFt}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^\d.]/g, '');
                          setAreaSqFt(raw === '' ? 0 : Number(raw));
                        }}
                        placeholder="e.g. 4800"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-white tabular-nums font-semibold"
                      />
                      <span className="text-[10px] text-amber-800 font-medium mt-0.5 block">
                        {areaSqFt > 0 ? `= ${(areaSqFt / 2400).toFixed(2)} Ground (${(areaSqFt / 435.6).toFixed(2)} Cents)` : 'Enter manually or add plots below'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Water Source
                      </label>
                      <input
                        type="text"
                        value={waterSource}
                        onChange={(e) => setWaterSource(e.target.value)}
                        placeholder="e.g. Sweet Groundwater at 25 ft / Borewell"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Each Plot Sq.Ft
                    </label>
                    <p className="text-[10px] text-slate-500 mb-2">
                      Type each plot size (e.g. 1200, 2400) and click Add. Total is calculated in one box.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={plotSizeInput}
                        onChange={(e) => setPlotSizeInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addPlotSize();
                          }
                        }}
                        placeholder="e.g. 1200"
                        className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
                      />
                      <button
                        type="button"
                        onClick={addPlotSize}
                        className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors whitespace-nowrap"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Add
                      </button>
                    </div>
                    <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                      {plotSizes.length > 0 ? (
                        <>
                          <div className="flex flex-wrap gap-2">
                            {plotSizes.map((size, idx) => (
                              <span
                                key={`${size}-${idx}`}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-800 bg-white border border-slate-300 rounded-lg"
                              >
                                <span>{size} sq.ft</span>
                                <button
                                  type="button"
                                  onClick={() => removePlotSize(idx)}
                                  className="text-slate-500 hover:text-rose-600 transition-colors"
                                  aria-label={`Remove plot size ${size}`}
                                  title="Remove"
                                >
                                  <XLg className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="mt-2 text-[11px] font-bold text-amber-900">
                            Total: {plotSizes.reduce((acc, item) => acc + parsePlotSizeValue(item), 0).toLocaleString('en-IN')} sq.ft
                          </div>
                        </>
                      ) : (
                        <div className="text-[10px] text-slate-500">No individual plot sizes added.</div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    UDS Extent (Sq.Ft)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={plotUds}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d.]/g, '');
                      setPlotUds(raw);
                      setPlotUdsTouched(true);
                    }}
                    placeholder="e.g. 1200"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-white tabular-nums"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Individual land ownership share (manual)
                  </span>
                </div>
              </div>
            )}

            {/* CONDITIONAL SECTION: FLAT & APARTMENT SPECIFIC INPUTS */}
            {propertyType === 'flat' && (
              <div className="p-4 bg-blue-50/60 border border-blue-200/80 rounded-2xl space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider">
                  <Building className="w-4 h-4 text-blue-700" />
                  Flat & Apartment Specifications
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Configuration */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Configuration *
                    </label>
                    <input
                      type="text"
                      required
                      value={bhk}
                      onChange={(e) => setBhk(e.target.value)}
                      placeholder="e.g. 3 BHK Luxury"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-white font-medium"
                    />
                  </div>

                  {/* Building Age */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Building Age *
                    </label>
                    <input
                      type="text"
                      required
                      value={buildingAge}
                      onChange={(e) => setBuildingAge(e.target.value)}
                      placeholder="e.g. Brand New (Under 1 Year)"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-white font-medium"
                    />
                  </div>

                  {/* Which Floor */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Which Floor *
                    </label>
                    <input
                      type="text"
                      value={floorNumber}
                      onChange={(e) => setFloorNumber(e.target.value)}
                      placeholder="e.g. 3rd Floor of 12 Floors"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-white"
                    />
                  </div>
                </div>

                {/* Bedrooms, Bathrooms & Rent / Sale Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Bedrooms */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Bedrooms *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      placeholder="e.g. 3"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white font-medium tabular-nums"
                    />
                  </div>

                  {/* Bathrooms */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Bathrooms *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      placeholder="e.g. 2"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white font-medium tabular-nums"
                    />
                  </div>

                  {/* Property Status: Sale or Rent */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Property Status *
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-white border border-slate-300 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setPropertyStatus('For Sale')}
                        className={`py-1.5 text-xs font-bold rounded transition-colors ${
                          propertyStatus === 'For Sale'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        For Sale
                      </button>
                      <button
                        type="button"
                        onClick={() => setPropertyStatus('For Rent')}
                        className={`py-1.5 text-xs font-bold rounded transition-colors ${
                          propertyStatus === 'For Rent'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        For Rent
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      {isFlatRent
                        ? 'Monthly rent pricing will be used.'
                        : 'One-time sale price will be used.'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Super Built-Up Sq.Ft */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Super Built-Up Area (Sq.Ft) *
                    </label>
                    <input
                      type="number"
                      required
                      min="400"
                      max="15000"
                      value={areaSqFt}
                      onChange={(e) => setAreaSqFt(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-white tabular-nums font-semibold"
                    />
                  </div>

                  {/* UDS Share for Flat */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      UDS (Undivided Share) Sq.Ft
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={flatUds}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^\d.]/g, '');
                        setFlatUds(raw);
                        setFlatUdsTouched(true);
                      }}
                      placeholder="e.g. 550"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-white tabular-nums"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      {(() => {
                        const udsNum = parseFloat(flatUds);
                        return areaSqFt > 0 && Number.isFinite(udsNum) && udsNum > 0
                          ? `${Math.round((udsNum / areaSqFt) * 100)}% UDS Ratio`
                          : 'Enter manually';
                      })()}
                    </span>
                  </div>

                  {/* Right Now Construction YES / NO Button */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Right Now Under Construction? *
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-white border border-slate-300 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setUnderConstruction(true)}
                        className={`py-1 text-xs font-bold rounded transition-colors ${
                          underConstruction
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setUnderConstruction(false)}
                        className={`py-1 text-xs font-bold rounded transition-colors ${
                          !underConstruction
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        No (Ready)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Handover Planned Month, Year and Date */}
                <div className="p-3 bg-white border border-blue-200 rounded-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-900 block">
                        Handover Planned Month, Year & Date
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {underConstruction
                          ? 'Expected date when developer will hand over keys'
                          : 'Immediate handover or ready possession date'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar3 className="w-4 h-4 text-blue-600" />
                      <input
                        type="date"
                        value={handoverDate}
                        onChange={(e) => setHandoverDate(e.target.value)}
                        className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-slate-50 focus:bg-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Car Parking */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Car Parking Provision
                    </label>
                    <select
                      value={carParking}
                      onChange={(e) => setCarParking(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white"
                    >
                      <option value="Dedicated Covered Parking">Dedicated Covered Parking</option>
                      <option value="Open Paver Parking">Open Paver Parking</option>
                      <option value="2+ Cars Parking Space">2+ Cars Parking Space</option>
                      <option value="No Dedicated Parking">No Dedicated Parking</option>
                    </select>
                  </div>

                  {/* Lift Access */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Lift Access
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-white border border-slate-300 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setLiftAccess(true)}
                        className={`py-1 text-xs font-bold rounded transition-colors ${
                          liftAccess
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setLiftAccess(false)}
                        className={`py-1 text-xs font-bold rounded transition-colors ${
                          !liftAccess
                            ? 'bg-slate-800 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {/* CCTV Access */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      CCTV Access
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-white border border-slate-300 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setCctvAccess(true)}
                        className={`py-1 text-xs font-bold rounded transition-colors ${
                          cctvAccess
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setCctvAccess(false)}
                        className={`py-1 text-xs font-bold rounded transition-colors ${
                          !cctvAccess
                            ? 'bg-slate-800 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>

                {/* Water Source */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Water Source
                  </label>
                  <input
                    type="text"
                    value={waterSource}
                    onChange={(e) => setWaterSource(e.target.value)}
                    placeholder="e.g. Sweet Groundwater at 25 ft / Metro + Borewell"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Benefits */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckLg className="w-4 h-4 text-amber-600" />
                Benefits (shown inside property details)
              </span>
              <p className="text-[10px] text-slate-500">
                Type details like Configuration, Building Age, Floor, Bedrooms, Bathrooms, Total Area, or luxury count, then click Add.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addBenefit();
                    }
                  }}
                  placeholder="e.g. Configuration: 3 BHK, Bedrooms: 3, Bathrooms: 2, 5 Luxuries"
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
                />
                <button
                  type="button"
                  onClick={addBenefit}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
              {benefits.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {benefits.map((benefit, idx) => (
                    <span
                      key={`${benefit}-${idx}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-800 bg-white border border-slate-300 rounded-lg"
                    >
                      <span>{benefit}</span>
                      <button
                        type="button"
                        onClick={() => removeBenefit(idx)}
                        className="text-slate-500 hover:text-rose-600 transition-colors"
                        aria-label={`Remove benefit ${benefit}`}
                        title="Remove"
                      >
                        <XLg className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Approvals, Facing & Utilities */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Facing / Vastu
                </label>
                <select
                  value={facing}
                  onChange={(e) => setFacing(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-white"
                >
                  <option value="East">East Facing (Most Preferred)</option>
                  <option value="North">North Facing</option>
                  <option value="North-East">North-East Corner</option>
                  <option value="West">West Facing</option>
                  <option value="South">South Facing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Statutory Approval Status
                </label>
                <select
                  value={approval}
                  onChange={(e) => setApproval(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-white"
                >
                  <option value="CMDA Approved">CMDA Approved</option>
                  <option value="DTCP Approved">DTCP Approved</option>
                  <option value="CMDA & RERA Approved">CMDA & TNRERA Approved</option>
                  <option value="TNRERA Registered">TNRERA Registered</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Approach Road Width
                </label>
                <input
                  type="text"
                  value={roadWidth}
                  onChange={(e) => setRoadWidth(e.target.value)}
                  placeholder="e.g. 40 Feet Bitumen / 60 Feet"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
                />
              </div>
            </div>

            {/* Seller Contact Info */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Seller Verification & Direct Inquiry
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required={!isEditing}
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    placeholder="e.g. S. Ramanathan"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Contact Phone (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required={!isEditing}
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    placeholder="+91 98401 xxxxx"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* View Details Visibility */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      showDetailsInView
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {showDetailsInView ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide block">
                      Can I Mention Details in View Details?
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed max-w-md">
                      {showDetailsInView
                        ? 'Yes — photos, specifications, description, amenities and landmarks will be visible in the public View Details card.'
                        : 'No — full property details stay private. Buyers will see only the basic card information and can request details on WhatsApp.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 p-1 bg-white border border-slate-300 rounded-xl w-full sm:w-44 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowDetailsInView(true)}
                    className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                      showDetailsInView
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDetailsInView(false)}
                    className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                      !showDetailsInView
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            {submitError && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold leading-relaxed text-rose-700"
              >
                {submitError}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isUploadingPhotos}
                aria-busy={isSubmitting || isUploadingPhotos}
                className="w-full py-3.5 px-4 text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>
                  {isUploadingPhotos
                    ? 'Uploading photos to Cloudinary...'
                    : isSubmitting
                      ? 'Saving to MongoDB...'
                      : isEditing
                        ? 'Save Updated Property Details'
                        : 'Publish Property on RJ Land Ventures'}
                </span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
