export const CHATTOGRAM_AREAS = [
  'Agrabad',
  'Anderkilla',
  'Bakalia',
  'Bayazid Bostami',
  'Chawkbazar',
  'Chittagong Cantonment',
  'Double Mooring',
  'GEC Circle',
  'Halishahar',
  'Khulshi',
  'Kotwali',
  'Nasirabad',
  'New Market',
  'O.R. Nizam Road',
  'Pahartali',
  'Panchlaish',
  'Patenga',
  'Sadarghat',
] as const

export const MARKETPLACE_CATEGORIES = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Fashion & Apparel', slug: 'fashion-apparel' },
  { name: 'Home & Garden', slug: 'home-garden' },
  { name: 'Vehicles', slug: 'vehicles' },
  { name: 'Services', slug: 'services' },
  { name: 'Books & Education', slug: 'books-education' },
  { name: 'Sports & Hobbies', slug: 'sports-hobbies' },
  { name: 'Pets', slug: 'pets' },
] as const

export const COMMUNITY_CATEGORIES = [
  { name: 'Local News', slug: 'local-news' },
  { name: 'Events', slug: 'events' },
  { name: 'Discussions', slug: 'discussions' },
  { name: 'Announcements', slug: 'announcements' },
  { name: 'Lost & Found', slug: 'lost-found' },
  { name: 'Help & Support', slug: 'help-support' },
] as const

export const PRODUCT_CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
] as const

export const PRICE_RANGES = [
  { min: 0, max: 1000, label: 'Under ৳1,000' },
  { min: 1000, max: 5000, label: '৳1,000 - ৳5,000' },
  { min: 5000, max: 10000, label: '৳5,000 - ৳10,000' },
  { min: 10000, max: 25000, label: '৳10,000 - ৳25,000' },
  { min: 25000, max: 50000, label: '৳25,000 - ৳50,000' },
  { min: 50000, max: Infinity, label: 'Above ৳50,000' },
] as const

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
] as const
