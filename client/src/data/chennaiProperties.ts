export interface Property {
  id: string;
  title: string;
  type: 'plot' | 'flat';
  category: string;
  locality: string;
  zone: string;
  address: string;
  price: number; // in INR
  priceDisplay: string;
  pricePerUnit: string;
  areaSqFt: number;
  landUnits?: {
    grounds?: number;
    cents?: number;
  };
  bhk?: string;
  /** Number of bedrooms (flats/apartments). */
  bedrooms?: number;
  /** Number of bathrooms (flats/apartments). */
  bathrooms?: number;
  /** Whether the flat is listed for sale or monthly rent. */
  propertyStatus?: 'For Sale' | 'For Rent';
  facing: 'East' | 'North' | 'North-East' | 'West' | 'South';
  approval: 'CMDA Approved' | 'DTCP Approved' | 'CMDA & RERA Approved' | 'TNRERA Registered';
  reraNumber?: string;
  approvalNumber?: string;
  pattaStatus: 'Clear Patta Ready' | 'Chitta & Patta Available' | 'Individual Patta Guaranteed';
  image: string;
  gallery: string[];
  description: string;
  highlights: string[];
  amenities: string[];
  nearbyLandmarks: {
    name: string;
    distance: string;
  }[];
  possession: 'Ready to Construct' | 'Ready to Move' | 'Under Construction (Possession Dec 2026)' | 'Immediate Registration';
  isFeatured?: boolean;
  isVerified: boolean;
  sellerName?: string;
  sellerPhone?: string;
  /** Whether the full property details are shown publicly in the View Details card. */
  showDetailsInView?: boolean;
  uds?: number; // Undivided Share of Land for flats in sq.ft
  waterSource: string;
  roadWidth: string;
  googleMapsUrl?: string;
  landType?: string;
  totalPlots?: string;
  /** Individual plot sizes entered manually for land/plot listings (sq.ft or as typed). */
  plotSizes?: string[];
  carParking?: string;
  liftAccess?: boolean;
  cctvAccess?: boolean;
  buildingAge?: string;
  floorNumber?: string;
  underConstruction?: boolean;
  handoverDate?: string;
  /** Mark a property as sold (shows SOLD badge on listing cards). */
  isSold?: boolean;
  /** Manually added benefit tags shown on property cards. */
  benefits?: string[];
}

export const CHENNAI_PROPERTIES: Property[] = [
  {
    id: 'chennai-plot-ecr-01',
    title: 'Emerald Bay Coastal Villa Plots',
    type: 'plot',
    category: 'Gated Community Villa Plot',
    locality: 'Akkarai, East Coast Road (ECR)',
    zone: 'ECR Coast',
    address: 'Near Akkarai Beach Junction, ECR, Chennai - 600119',
    price: 19500000,
    priceDisplay: '₹1.95 Cr',
    pricePerUnit: '₹8,125 / sq.ft (₹1.95 Cr / Ground)',
    areaSqFt: 2400,
    landUnits: {
      grounds: 1.0,
      cents: 5.51,
    },
    facing: 'East',
    approval: 'CMDA & RERA Approved',
    reraNumber: 'TNRERA/A/0452/2025',
    approvalNumber: 'CMDA/PL/2024/098',
    pattaStatus: 'Clear Patta Ready',
    image: '/src/assets/images/chennai_coastal_land_1794240292550.jpg',
    gallery: [
      '/src/assets/images/chennai_coastal_land_1794240292550.jpg',
      '/src/assets/images/chennai_villa_plot_1794240292802.jpg',
      '/src/assets/images/chennai_hero_luxury_1794240290491.jpg',
    ],
    description: 'Exclusive 1 Ground prime coastal villa land situated in an elite gated avenue 350 meters from the Akkarai shoreline. Clean residential title with 40-feet wide bitumen roads, underground stormwater drains, sweet potable groundwater at just 18 feet, and lush coastal ambiance. Ideal for bespoke luxury private villas.',
    highlights: [
      '1 Full Ground (2,400 sq.ft) - perfect 40x60 dimensions',
      '100% East Facing with Sea Breeze',
      'High ground with zero waterlogging during monsoons',
      'CMDA Planning Permit with clear individual Patta',
    ],
    amenities: [
      '40-ft Wide Blacktop Roads',
      'Underground EB Cabling',
      'Avenue Coconut & Palm Trees',
      '24/7 Gated Security & CCTV',
      'Compound Wall for Layout',
      'Streetlight Illumination',
    ],
    nearbyLandmarks: [
      { name: 'Akkarai Beach Promenade', distance: '350 m' },
      { name: 'Sholinganallur IT SEZ Junction', distance: '4.8 km' },
      { name: 'MGM Dizzee World & Muttukadu', distance: '6.2 km' },
      { name: 'Adyar Circle', distance: '12 km' },
    ],
    possession: 'Immediate Registration',
    isFeatured: true,
    isVerified: true,
    waterSource: 'Sweet Potable Groundwater (TDS < 320)',
    roadWidth: '40 Feet Broad Layout Road',
  },
  {
    id: 'chennai-flat-omr-02',
    title: 'The Marina Horizon Sky Villas & Flats',
    type: 'flat',
    category: 'Luxury Flat',
    locality: 'Kottivakkam / Thiruvanmiyur Extension',
    zone: 'ECR Coast',
    address: 'Seaward Road Link, Kottivakkam, Chennai - 600041',
    price: 38500000,
    priceDisplay: '₹3.85 Cr',
    pricePerUnit: '₹15,714 / sq.ft',
    areaSqFt: 2450,
    bhk: '3.5 BHK + Servant Quarter',
    bedrooms: 4,
    bathrooms: 4,
    propertyStatus: 'For Sale',
    facing: 'East',
    approval: 'TNRERA Registered',
    reraNumber: 'TNRERA/BL/0118/2024',
    approvalNumber: 'CMDA/C3/4482/2023',
    pattaStatus: 'Clear Patta Ready',
    image: '/src/assets/images/chennai_flat_interior_1794240293038.jpg',
    gallery: [
      '/src/assets/images/chennai_flat_interior_1794240293038.jpg',
      '/src/assets/images/chennai_hero_luxury_1794240290491.jpg',
      '/src/assets/images/chennai_omr_skyline_1794240293319.jpg',
    ],
    description: 'Breathtaking Bay of Bengal panoramic views from private 28-foot wrap-around cantilevered balconies. Designed with Italian Bottochino marble, Burma teak finishes, smart biometric access, and floor-to-ceiling double-glazed acoustic glass that insulates from the city while framing the ocean sunrise.',
    highlights: [
      'Unobstructed Bay of Bengal sunrise views',
      'High UDS of 1,120 sq.ft on prime South Chennai land',
      'Only 2 apartments per floor with private elevator lobby',
      '100% Vastu compliant East entrance and Northeast Pooja',
    ],
    amenities: [
      'Rooftop Infinity Lap Pool',
      'Clubhouse with TechnoGym & Yoga Deck',
      '2 Covered Basement Car Parks',
      'Metrowater Connection + 24/7 RO Backup',
      '100% Full Generator Power Backup',
      'EV Car Charging Station per Slot',
    ],
    nearbyLandmarks: [
      { name: 'Thiruvanmiyur Beach', distance: '1.2 km' },
      { name: 'TIDEL Park & Ascendas IT Corridor', distance: '3.1 km' },
      { name: 'Adyar Besant Nagar', distance: '4.5 km' },
      { name: 'Chennai International Airport', distance: '13 km' },
    ],
    possession: 'Ready to Move',
    isFeatured: true,
    isVerified: true,
    uds: 1120,
    waterSource: 'Metrowater Line + Borewell with Central RO Plant',
    roadWidth: '60 Feet Main Road Access',
  },
  {
    id: 'chennai-plot-omr-03',
    title: 'Silicon Crest Gated IT Villa Plots',
    type: 'plot',
    category: 'Residential Plot',
    locality: 'Siruseri / Navalur, OMR IT Expressway',
    zone: 'OMR Corridor',
    address: 'Opposite SIPCOT IT Park Phase-2, Siruseri, Chennai - 603103',
    price: 6600000,
    priceDisplay: '₹66.0 Lakhs',
    pricePerUnit: '₹5,500 / sq.ft',
    areaSqFt: 1200,
    landUnits: {
      grounds: 0.5,
      cents: 2.75,
    },
    facing: 'North',
    approval: 'CMDA & RERA Approved',
    reraNumber: 'TNRERA/P/0891/2024',
    approvalNumber: 'CMDA/REG/0122/2023',
    pattaStatus: 'Clear Patta Ready',
    image: '/src/assets/images/chennai_villa_plot_1794240292802.jpg',
    gallery: [
      '/src/assets/images/chennai_villa_plot_1794240292802.jpg',
      '/src/assets/images/chennai_omr_skyline_1794240293319.jpg',
      '/src/assets/images/chennai_hero_luxury_1794240290491.jpg',
    ],
    description: 'Strategically located directly opposite Siruseri SIPCOT IT park where over 150,000 tech professionals work. Prime CMDA approved residential villa plots with pre-laid underground drainage, storm channels, EB lines, and children play park. Walk to work for OMR tech professionals.',
    highlights: [
      'Just 400 meters off the 6-lane OMR IT Expressway',
      'Upcoming Chennai Metro Phase 2 Siruseri Station within 900m',
      'High rental yield potential for independent villa or duplex',
      'Bank approved by SBI, HDFC, and ICICI for up to 80% plot loan',
    ],
    amenities: [
      '30-ft & 40-ft Paved Bitumen Roads',
      'Underground Drainage & Sewerage',
      'Dedicated Children Play Zone & Park',
      'Solar Street Lamps',
      'Grand Entrance Arch with Boom Barrier',
      'Landscaped Walking Jogging Track',
    ],
    nearbyLandmarks: [
      { name: 'SIPCOT IT Park Gate 1 (TCS/Syntel)', distance: '600 m' },
      { name: 'The Marina Mall & INOX', distance: '1.8 km' },
      { name: 'Chettinad Health City Hospital', distance: '4.5 km' },
      { name: 'Sholinganallur Junction', distance: '7.2 km' },
    ],
    possession: 'Ready to Construct',
    isFeatured: true,
    isVerified: true,
    waterSource: 'Abundant Groundwater + Piped Water Supply',
    roadWidth: '30 & 40 Feet Interconnecting Roads',
  },
  {
    id: 'chennai-flat-omr-04',
    title: 'Cyber Towers Premium Lifestyle Flats',
    type: 'flat',
    category: 'High-Rise Apartment',
    locality: 'Sholinganallur Junction, OMR',
    zone: 'OMR Corridor',
    address: 'ELCOT IT Park Road, Sholinganallur, Chennai - 600119',
    price: 10300000,
    priceDisplay: '₹1.03 Cr',
    pricePerUnit: '₹7,463 / sq.ft',
    areaSqFt: 1380,
    bhk: '3 BHK Compact Luxury',
    bedrooms: 3,
    bathrooms: 3,
    propertyStatus: 'For Sale',
    facing: 'North-East',
    approval: 'CMDA & RERA Approved',
    reraNumber: 'TNRERA/BL/0719/2024',
    approvalNumber: 'CMDA/MSB/3301/2023',
    pattaStatus: 'Clear Patta Ready',
    image: '/src/assets/images/chennai_hero_luxury_1794240290491.jpg',
    gallery: [
      '/src/assets/images/chennai_hero_luxury_1794240290491.jpg',
      '/src/assets/images/chennai_omr_skyline_1794240293319.jpg',
      '/src/assets/images/chennai_flat_interior_1794240293038.jpg',
    ],
    description: 'Resort-style urban residences with 78% open green landscaped spaces right at the heart of Sholinganallur junction, linking OMR and ECR. Features high-speed elevators, sports courts, supermarket within campus, and immediate connectivity to HCL, Wipro, and Cognizant campuses.',
    highlights: [
      'North-East entrance with uninterrupted pool and garden view',
      'Metrowater piped supply active in the complex',
      'High UDS of 580 sq.ft per apartment',
      'Zero dead space floor plan with large modular kitchen',
    ],
    amenities: [
      'Olympic-Length Swimming Pool & Kids Pool',
      'Multi-purpose Badminton & Tennis Courts',
      '15,000 sq.ft Grand Air-Conditioned Clubhouse',
      'Dedicated Pet Park and Jogging Trail',
      '100% Power Backup for Common & Flat',
      'Integrated Retail & Pharmacy Inside Campus',
    ],
    nearbyLandmarks: [
      { name: 'ELCOT SEZ (Wipro / HCL)', distance: '800 m' },
      { name: 'Upcoming Metro Phase 2 Junction', distance: '500 m' },
      { name: 'Gleneagles Global Health City', distance: '2.4 km' },
      { name: 'ECR Link Road Access', distance: '1.9 km' },
    ],
    possession: 'Ready to Move',
    isFeatured: true,
    isVerified: true,
    uds: 580,
    waterSource: 'Metrowater Direct Connection + On-site Water Treatment',
    roadWidth: '80 Feet Wide Connecting Corridor',
  },
  {
    id: 'chennai-flat-annanagar-05',
    title: 'The Sovereign Anna Nagar Luxury Boutique Residence',
    type: 'flat',
    category: 'Boutique Flat',
    locality: 'Anna Nagar West Extension',
    zone: 'Central Chennai',
    address: '6th Avenue, Anna Nagar West Extn, Chennai - 600101',
    price: 24500000,
    priceDisplay: '₹2.45 Cr',
    pricePerUnit: '₹14,000 / sq.ft',
    areaSqFt: 1750,
    bhk: '3 BHK Signature Living',
    bedrooms: 3,
    bathrooms: 4,
    propertyStatus: 'For Sale',
    facing: 'North',
    approval: 'CMDA Approved',
    approvalNumber: 'CMDA/PP/8812/2023',
    pattaStatus: 'Clear Patta Ready',
    image: '/src/assets/images/chennai_flat_interior_1794240293038.jpg',
    gallery: [
      '/src/assets/images/chennai_flat_interior_1794240293038.jpg',
      '/src/assets/images/chennai_hero_luxury_1794240290491.jpg',
      '/src/assets/images/chennai_omr_skyline_1794240293319.jpg',
    ],
    description: 'An exclusive boutique development with only 8 aristocratic residences in prime Anna Nagar. Enjoy massive undivided share of land (UDS 820 sq.ft) in Central Chennai, 2 covered car parks, 11-foot clear ceiling heights, and serene tree-lined avenue setting.',
    highlights: [
      'Exceptional UDS of 820 sq.ft in prime Anna Nagar Central',
      'Only 2 homes per floor ensuring maximum privacy',
      'Schindler smart elevators with fingerprint security',
      'Minutes from Anna Nagar Roundtana, metro & premium schools',
    ],
    amenities: [
      '2 Dedicated Independent Covered Stilt Car Parks',
      'Rooftop Terrace Garden & Gazebo Party Area',
      'Metrowater + Deep Borewell with Iron Filter',
      'Silent Kirloskar Generator Backup (100%)',
      'Automated Video Door Phone & Biometric Locks',
      'Rainwater Harvesting with 3 recharge wells',
    ],
    nearbyLandmarks: [
      { name: 'Anna Nagar Tower Metro Station', distance: '1.4 km' },
      { name: 'VR Chennai Mall & PVR', distance: '2.1 km' },
      { name: 'SBOA School & Junior College', distance: '850 m' },
      { name: 'Kalyan Jewellers & Roundtana', distance: '1.6 km' },
    ],
    possession: 'Ready to Move',
    isFeatured: true,
    isVerified: true,
    uds: 820,
    waterSource: 'Chennai CMWSSB Metrowater + Borewell',
    roadWidth: '40 Feet Broad Avenue Road',
  },
  {
    id: 'chennai-plot-gst-06',
    title: 'Green Valley Sovereign Township Plots',
    type: 'plot',
    category: 'Gated Community Villa Plot',
    locality: 'Guduvanchery, GST Road Corridor',
    zone: 'GST & Suburbs',
    address: 'Near New Kilambakkam Bus Terminus (KCBT), GST Road, Chennai - 603202',
    price: 3840000,
    priceDisplay: '₹38.4 Lakhs',
    pricePerUnit: '₹3,200 / sq.ft',
    areaSqFt: 1200,
    landUnits: {
      grounds: 0.5,
      cents: 2.75,
    },
    facing: 'East',
    approval: 'DTCP Approved',
    reraNumber: 'TNRERA/P/1042/2024',
    approvalNumber: 'DTCP/CHEN/089/2023',
    pattaStatus: 'Clear Patta Ready',
    image: '/src/assets/images/chennai_villa_plot_1794240292802.jpg',
    gallery: [
      '/src/assets/images/chennai_villa_plot_1794240292802.jpg',
      '/src/assets/images/chennai_coastal_land_1794240292550.jpg',
      '/src/assets/images/chennai_hero_luxury_1794240290491.jpg',
    ],
    description: 'High-appreciation gated layout situated in the fast-growing GST corridor, 10 minutes from Chennai’s landmark Kilambakkam KCBT bus terminus. Features clear legal titles, sweet drinking water, complete boundary masonry walls, LED avenue lighting, and fast connection to SRM University and MEPZ.',
    highlights: [
      'Unmatched entry price of ₹38.4L for a full 1,200 sq.ft plot',
      '10 minutes to Kalaignar Centenary Bus Terminus (KCBT)',
      'High ground with red soil and sweet potable water',
      'Pre-approved for bank loans with 0% processing fee offers',
    ],
    amenities: [
      'Tar Top Roads with Concrete Paver Footpaths',
      'Individual Water Connection Tap to each plot',
      'Children Play Area with Outdoor Equipment',
      'Overhead Water Tank of 50,000 Litres Capacity',
      'CCTV Monitored Layout with 24/7 Security guard',
      'Lush Native Avenue Plantation',
    ],
    nearbyLandmarks: [
      { name: 'Guduvanchery Railway Station', distance: '1.9 km' },
      { name: 'Kilambakkam Terminus (KCBT)', distance: '4.5 km' },
      { name: 'SRM University & Medical College', distance: '3.8 km' },
      { name: 'Mahindra World City', distance: '14 km' },
    ],
    possession: 'Immediate Registration',
    isFeatured: false,
    isVerified: true,
    waterSource: 'Sweet Potable Groundwater at 35 Feet',
    roadWidth: '33 & 40 Feet Roads',
  },
  {
    id: 'chennai-flat-velachery-07',
    title: 'Phoenix Grand Square Residences',
    type: 'flat',
    category: 'High-Rise Apartment',
    locality: 'Velachery Bypass Road',
    zone: 'South Chennai',
    address: 'Near Phoenix MarketCity, Bypass Road, Velachery, Chennai - 600042',
    price: 9200000,
    priceDisplay: '₹92.0 Lakhs',
    pricePerUnit: '₹8,000 / sq.ft',
    areaSqFt: 1150,
    bhk: '2.5 BHK Smart Space',
    bedrooms: 3,
    bathrooms: 2,
    propertyStatus: 'For Sale',
    facing: 'North',
    approval: 'CMDA & RERA Approved',
    reraNumber: 'TNRERA/A/0229/2024',
    approvalNumber: 'CMDA/S3/1094/2022',
    pattaStatus: 'Clear Patta Ready',
    image: '/src/assets/images/chennai_hero_luxury_1794240290491.jpg',
    gallery: [
      '/src/assets/images/chennai_hero_luxury_1794240290491.jpg',
      '/src/assets/images/chennai_flat_interior_1794240293038.jpg',
      '/src/assets/images/chennai_omr_skyline_1794240293319.jpg',
    ],
    description: 'Centrally located luxury apartment just 3 minutes from Phoenix MarketCity Mall and Velachery MRTS station. Superb rental demand for IT and business professionals with rapid access to Guindy, OMR, and Airport.',
    highlights: [
      'Strategic South Chennai node with dual IT/Retail access',
      'Dedicated study / home-office room (2.5 BHK)',
      'Covered car parking and high speed elevators',
      'Metrowater pipeline commissioned and operational',
    ],
    amenities: [
      'Rooftop Clubhouse & Multi-Gym',
      'Metrowater Connection + Borewell',
      'Power Backup for Elevators & Homes',
      'Intercom & Video Security',
      'Children Play Park & Senior Citizen Sitting Zone',
      'Waste Water Recycling STP Plant',
    ],
    nearbyLandmarks: [
      { name: 'Phoenix MarketCity Mall', distance: '650 m' },
      { name: 'Velachery MRTS Railway Station', distance: '1.1 km' },
      { name: 'Guindy Olympia Tech Park', distance: '4.2 km' },
      { name: 'IIT Madras Gate', distance: '3.5 km' },
    ],
    possession: 'Ready to Move',
    isFeatured: false,
    isVerified: true,
    uds: 490,
    waterSource: 'Metrowater + Borewell',
    roadWidth: '60 Feet Wide Road',
  },
  {
    id: 'chennai-plot-poonamallee-08',
    title: 'Metro Crest Satellite Township Plots',
    type: 'plot',
    category: 'Residential Plot',
    locality: 'Poonamallee / Thirumazhisai',
    zone: 'West Chennai',
    address: 'Near Thirumazhisai Satellite City, Poonamallee, Chennai - 600124',
    price: 5700000,
    priceDisplay: '₹57.0 Lakhs',
    pricePerUnit: '₹3,800 / sq.ft',
    areaSqFt: 1500,
    landUnits: {
      grounds: 0.625,
      cents: 3.44,
    },
    facing: 'North-East',
    approval: 'CMDA Approved',
    approvalNumber: 'CMDA/PL/W/294/2024',
    pattaStatus: 'Clear Patta Ready',
    image: '/src/assets/images/chennai_villa_plot_1794240292802.jpg',
    gallery: [
      '/src/assets/images/chennai_villa_plot_1794240292802.jpg',
      '/src/assets/images/chennai_coastal_land_1794240292550.jpg',
      '/src/assets/images/chennai_hero_luxury_1794240290491.jpg',
    ],
    description: 'Prime investment plots in West Chennai’s biggest upcoming growth engine. Just 700 meters from the under-construction Chennai Metro Phase 2 Poonamallee depot and 5 minutes from the newly announced Thirumazhisai New Satellite City and Pattabiram Tidel Park.',
    highlights: [
      'Direct frontage on 40-ft road with North-East corner entry',
      'Tremendous capital appreciation fueled by Metro Phase 2',
      'CMDA approved layout with clear computerized patta',
      '100% dry high elevation land with clean sweet water',
    ],
    amenities: [
      '40-ft and 30-ft Tar Roads with storm drains',
      'Streetlights with automatic timer sensors',
      'Gated compound with landscaped entry arch',
      'Dedicated parks with walking paths',
      'Immediate electricity EB connection available',
    ],
    nearbyLandmarks: [
      { name: 'Poonamallee Metro Depot (Phase 2)', distance: '800 m' },
      { name: 'Panimalar / Saveetha Medical College', distance: '3.2 km' },
      { name: 'Bangalore National Highway (NH 48)', distance: '1.4 km' },
      { name: 'Porur Junction', distance: '8.5 km' },
    ],
    possession: 'Immediate Registration',
    isFeatured: false,
    isVerified: true,
    waterSource: 'Sweet Potable Groundwater',
    roadWidth: '40 Feet Layout Avenue',
  },
  {
    id: 'chennai-flat-porur-09',
    title: 'Mount Vista Garden Residences',
    type: 'flat',
    category: 'High-Rise Apartment',
    locality: 'Porur / Iyyappanthangal',
    zone: 'West Chennai',
    address: 'Near Sri Ramachandra Medical College, Mount Poonamallee Road, Chennai - 600116',
    price: 6860000,
    priceDisplay: '₹68.6 Lakhs',
    pricePerUnit: '₹7,000 / sq.ft',
    areaSqFt: 980,
    bhk: '2 BHK Modern Compact',
    bedrooms: 2,
    bathrooms: 2,
    propertyStatus: 'For Sale',
    facing: 'East',
    approval: 'CMDA & RERA Approved',
    reraNumber: 'TNRERA/BL/0931/2024',
    approvalNumber: 'CMDA/MSB/2103/2023',
    pattaStatus: 'Clear Patta Ready',
    image: '/src/assets/images/chennai_flat_interior_1794240293038.jpg',
    gallery: [
      '/src/assets/images/chennai_flat_interior_1794240293038.jpg',
      '/src/assets/images/chennai_hero_luxury_1794240290491.jpg',
      '/src/assets/images/chennai_omr_skyline_1794240293319.jpg',
    ],
    description: 'Compact, beautifully designed 2 BHK flats with zero wasted passages. Positioned just 4 minutes from Sri Ramachandra University & Hospital, DLF Cybercity, and Commerzone IT Park Porur.',
    highlights: [
      'High rental demand from doctors, healthcare and IT staff',
      'East-facing balcony with airy ventilation',
      '4 minutes to DLF Cybercity Porur',
      'Pre-approved for 85% home loan across major nationalized banks',
    ],
    amenities: [
      'Covered Parking Slot with EV plug point',
      'Air Conditioned Fitness Studio',
      'Automatic Johnson High Speed Elevators',
      '24/7 Security Surveillance & Intercom',
      'Rainwater Harvesting System',
    ],
    nearbyLandmarks: [
      { name: 'Sri Ramachandra Hospital & University', distance: '900 m' },
      { name: 'DLF Cybercity IT Park Porur', distance: '2.5 km' },
      { name: 'Porur Roundabout & Tollgate', distance: '1.8 km' },
      { name: 'Guindy Metro Station', distance: '7.0 km' },
    ],
    possession: 'Ready to Move',
    isFeatured: false,
    isVerified: true,
    uds: 415,
    waterSource: 'Metrowater and Treated Borewell',
    roadWidth: '50 Feet Feeder Road',
  },
  {
    id: 'chennai-plot-medavakkam-10',
    title: 'Grand Orchid Lakeview Plots',
    type: 'plot',
    category: 'Gated Community Villa Plot',
    locality: 'Medavakkam / Nanmangalam',
    zone: 'South Chennai',
    address: 'Nanmangalam Lake Reserve Road, Medavakkam, Chennai - 600100',
    price: 11700000,
    priceDisplay: '₹1.17 Cr',
    pricePerUnit: '₹6,500 / sq.ft',
    areaSqFt: 1800,
    landUnits: {
      grounds: 0.75,
      cents: 4.13,
    },
    facing: 'North',
    approval: 'CMDA Approved',
    approvalNumber: 'CMDA/PL/S/1102/2023',
    pattaStatus: 'Clear Patta Ready',
    image: '/src/assets/images/chennai_coastal_land_1794240292550.jpg',
    gallery: [
      '/src/assets/images/chennai_coastal_land_1794240292550.jpg',
      '/src/assets/images/chennai_villa_plot_1794240292802.jpg',
      '/src/assets/images/chennai_hero_luxury_1794240290491.jpg',
    ],
    description: 'Rare 0.75 Ground villa plot in developed South Chennai hub of Medavakkam, abutting the tranquil Nanmangalam protected reserve greens. High water table with sweet water at 25 feet. Ideal for an independent 3-floor luxury family bungalow.',
    highlights: [
      'Prime residential enclave in Medavakkam with great quietude',
      'Direct connectivity to Velachery, OMR, and Tambaram',
      'CMDA layout sanction with individual computerized Patta',
      'Ready for immediate house plan sanction and construction',
    ],
    amenities: [
      '30-ft Wide Blacktop Internal Roads',
      'Solar Street Lamps throughout Layout',
      'Compound Wall with 24-hr Guard Cabin',
      'Pre-laid Underground EB Cables',
      'Children Green Lawn and Seating',
    ],
    nearbyLandmarks: [
      { name: 'Medavakkam Koot Road Junction', distance: '1.2 km' },
      { name: 'Nanmangalam Reserve Forest & Lake', distance: '400 m' },
      { name: 'Velachery MRTS Station', distance: '5.8 km' },
      { name: 'Tambaram Railway Station', distance: '7.5 km' },
    ],
    possession: 'Ready to Construct',
    isFeatured: false,
    isVerified: true,
    waterSource: 'Sweet Potable Groundwater at 25 Feet',
    roadWidth: '30 Feet Concrete Tar Road',
  },
];

export const CHENNAI_MICRO_MARKETS = [
  {
    name: 'OMR IT Corridor',
    code: 'OMR Corridor',
    count: '240+ Plots & Flats',
    avgSqftPrice: '₹5,500 – ₹9,500 / sq.ft.',
    growthRate: '+14.2% YoY',
    highlights:
      'OMR continues to attract homebuyers and investors thanks to its IT companies, growing infrastructure, and strong rental demand. With developments around SIPCOT IT Park, Metro Phase 2, and Marina Mall, this area offers promising opportunities for long-term investment.',
    recommendedFor:
      'IT professionals, property investors, and people looking for rental income.',
  },
  {
    name: 'ECR Scenic Coast',
    code: 'ECR Coast',
    count: '110+ Beachside Lands & Villas',
    avgSqftPrice: '₹7,500 – ₹18,000 / sq.ft.',
    growthRate: '+16.8% YoY',
    highlights:
      'If you prefer peaceful surroundings and premium coastal living, ECR is worth exploring. The area is known for its beachside villas, luxury homes, and relaxed lifestyle, making it attractive to both homebuyers and weekend property investors.',
    recommendedFor:
      'Luxury homebuyers, villa investors, and people looking for a weekend retreat.',
  },
  {
    name: 'South Chennai (Velachery / Medavakkam)',
    code: 'South Chennai',
    count: '185+ Flats & Plots',
    avgSqftPrice: '₹6,500 – ₹11,000 / sq.ft.',
    growthRate: '+11.5% YoY',
    highlights:
      'South Chennai offers a good mix of residential comfort and everyday convenience. With shopping destinations like Phoenix Marketcity, access to MRTS, and connectivity to major employment hubs, these neighbourhoods are popular among families and working professionals.',
    recommendedFor:
      'Families, working professionals, and first-time homebuyers.',
  },
  {
    name: 'Central Chennai (Anna Nagar / T. Nagar)',
    code: 'Central Chennai',
    count: '65+ Exclusive Residences',
    avgSqftPrice: '₹14,000 – ₹24,000 / sq.ft.',
    growthRate: '+9.4% YoY',
    highlights:
      'Central Chennai remains one of the city’s most established property markets. Known for its well-developed neighbourhoods, reputed schools, shopping streets, and excellent connectivity, it continues to appeal to buyers looking for premium residential locations.',
    recommendedFor:
      'Premium homebuyers, established families, and long-term property investors.',
  },
  {
    name: 'GST Road & Suburbs (Guduvanchery / Tambaram)',
    code: 'GST & Suburbs',
    count: '320+ Gated Township Plots',
    avgSqftPrice: '₹3,000 – ₹5,200 / sq.ft.',
    growthRate: '+18.1% YoY',
    highlights:
      'Looking for a property that fits your budget? GST Road and its surrounding suburbs offer more affordable options with improving connectivity. The upcoming infrastructure developments and access to suburban rail make this stretch interesting for buyers planning ahead.',
    recommendedFor:
      'First-time buyers, budget-conscious investors, and people looking for affordable plots.',
  },
  {
    name: 'West Chennai (Porur / Poonamallee)',
    code: 'West Chennai',
    count: '140+ Projects',
    avgSqftPrice: '₹4,000 – ₹7,800 / sq.ft.',
    growthRate: '+13.7% YoY',
    highlights:
      'West Chennai is gaining attention as residential and commercial development continues to expand. With access to IT parks, healthcare facilities, and improving metro connectivity, areas like Porur and Poonamallee offer opportunities for both homebuyers and long-term investors.',
    recommendedFor:
      'Families, healthcare professionals, and long-term investors.',
  },
];
