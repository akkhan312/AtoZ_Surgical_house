export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  categoryId: string;
  image: string;
  inStock: boolean;
  description: string;
  specifications: { icon: string; label: string }[];
  howToUse: string[];
  reviews: { name: string; time: string; text: string; rating: number }[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  productCount: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderId: string;
  status: 'placed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  estimatedArrival: string;
  items: { name: string; price: number; qty: number }[];
  total: number;
  placedAt: string;
}

export const categories: Category[] = [
  {
    id: 'diagnostic',
    name: 'Diagnostic Devices',
    description: 'Monitors, BP machines, & thermometers',
    icon: '🩺',
    productCount: 48,
  },
  {
    id: 'surgical',
    name: 'Surgical Equipment',
    description: 'Scalpels, forceps, & sterilization tools',
    icon: '🔬',
    productCount: 32,
  },
  {
    id: 'patient-care',
    name: 'Patient Care',
    description: 'Mobility aids & rehabilitation support',
    icon: '🧑‍⚕️',
    productCount: 27,
  },
  {
    id: 'diabetes',
    name: 'Diabetes Care',
    description: 'Glucometers, strips & insulin pens',
    icon: '💉',
    productCount: 19,
  },
  {
    id: 'furniture',
    name: 'Hospital Furniture',
    description: 'Beds, stretchers, & clinical seating',
    icon: '🛏️',
    productCount: 15,
  },
  {
    id: 'protective',
    name: 'Protective Equipment',
    description: 'Gloves, masks & safety gear',
    icon: '🧤',
    productCount: 23,
  },
];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Premium BP Monitor',
    subtitle: 'Atoz Surgical House Premium Series',
    price: 59.99,
    originalPrice: 79.99,
    rating: 4.8,
    reviewCount: 128,
    category: 'Diagnostic Devices',
    categoryId: 'diagnostic',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=300&fit=crop',
    inStock: true,
    description: 'The Atoz Surgical House Digital BP Monitor provides clinical accuracy for home monitoring. Featuring a one-touch operation system, it\'s designed for ease of use while maintaining professional-grade precision. Perfect for daily health tracking.',
    specifications: [
      { icon: '⚙️', label: 'Automatic' },
      { icon: '💾', label: 'Memory Storage' },
      { icon: '🖥️', label: 'Large LCD' },
      { icon: '🔋', label: 'Battery Operated' },
    ],
    howToUse: [
      'Sit quietly for 5 minutes before measurement.',
      'Wrap the cuff around your left upper arm.',
      'Press the Start button and remain still.',
    ],
    reviews: [
      { name: 'Sarah M.', time: '2 days ago', text: 'Very easy to read display, perfect for my elderly parents.', rating: 5 },
      { name: 'Ahmed K.', time: '1 week ago', text: 'Accurate readings, matches clinic measurements every time.', rating: 5 },
    ],
  },
  {
    id: 'p2',
    name: 'Littmann Classic III Stethoscope',
    subtitle: 'Dual Head Medical Grade',
    price: 124.99,
    rating: 4.9,
    reviewCount: 124,
    category: 'Diagnostic Devices',
    categoryId: 'diagnostic',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
    inStock: true,
    description: 'The Littmann Classic III is the most versatile stethoscope in the 3M Littmann line. It can be used for a wide range of clinical assessments of adult and pediatric patients.',
    specifications: [
      { icon: '🎵', label: 'Dual-sided' },
      { icon: '⚖️', label: 'Lightweight' },
      { icon: '🔊', label: 'High Acoustic' },
      { icon: '🎨', label: '20+ Colors' },
    ],
    howToUse: [
      'Insert eartips snugly into ear canals.',
      'Place diaphragm firmly on patient\'s skin.',
      'Use bell side for low-frequency sounds.',
    ],
    reviews: [
      { name: 'Dr. Omar', time: '3 days ago', text: 'Best stethoscope I\'ve ever used professionally.', rating: 5 },
    ],
  },
  {
    id: 'p3',
    name: 'Infrared No-Touch Thermometer',
    subtitle: 'Instant Read Professional Grade',
    price: 45.50,
    originalPrice: 62.00,
    rating: 4.7,
    reviewCount: 89,
    category: 'Diagnostic Devices',
    categoryId: 'diagnostic',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&h=300&fit=crop',
    inStock: true,
    description: 'Professional-grade infrared thermometer for instant, contactless temperature measurement. Features color-coded fever alerts and memory for 30 readings.',
    specifications: [
      { icon: '⚡', label: '1-Second Read' },
      { icon: '📊', label: 'Memory 30x' },
      { icon: '🎨', label: 'Color Alert' },
      { icon: '🔋', label: 'AAA Battery' },
    ],
    howToUse: [
      'Hold device 3-5cm from forehead.',
      'Press the trigger button.',
      'Read temperature from LCD display.',
    ],
    reviews: [
      { name: 'Fatima A.', time: '5 days ago', text: 'Very fast and accurate. Great for kids!', rating: 5 },
    ],
  },
  {
    id: 'p4',
    name: 'Precision Digital BP Monitor',
    subtitle: 'Automatic Upper Arm',
    price: 45.00,
    originalPrice: 59.00,
    rating: 4.8,
    reviewCount: 124,
    category: 'Diagnostic Devices',
    categoryId: 'diagnostic',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=300&fit=crop',
    inStock: true,
    description: 'Clinical-grade blood pressure monitor with WHO classification indicator. Detects irregular heartbeat and stores up to 60 readings per user.',
    specifications: [
      { icon: '❤️', label: 'Arrhythmia' },
      { icon: '💾', label: '60 Memories' },
      { icon: '🖥️', label: 'Large Screen' },
      { icon: '⚡', label: 'Fast Inflate' },
    ],
    howToUse: [
      'Sit comfortably with arm at heart level.',
      'Secure cuff 2cm above elbow.',
      'Press START and keep still until complete.',
    ],
    reviews: [
      { name: 'Khalid R.', time: '1 week ago', text: 'Consistent and accurate readings daily.', rating: 5 },
    ],
  },
  {
    id: 'p5',
    name: 'Elite Series Stethoscope - Silver Edition',
    subtitle: 'Professional Cardiology Grade',
    price: 120.00,
    rating: 4.9,
    reviewCount: 86,
    category: 'Diagnostic Devices',
    categoryId: 'diagnostic',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=300&fit=crop',
    inStock: true,
    description: 'Premium cardiology-grade stethoscope with exceptional acoustic sensitivity for cardiovascular, pulmonary and other assessments.',
    specifications: [
      { icon: '🎵', label: 'Cardiology' },
      { icon: '🔊', label: 'Ultra Acoustic' },
      { icon: '⚖️', label: 'Ergonomic' },
      { icon: '🛡️', label: 'Latex-free' },
    ],
    howToUse: [
      'Angle eartips forward for best fit.',
      'Use firm pressure for heart sounds.',
      'Switch to bell for murmur detection.',
    ],
    reviews: [
      { name: 'Dr. Layla', time: '2 weeks ago', text: 'Exceptional quality, highly recommend to colleagues.', rating: 5 },
    ],
  },
  {
    id: 'p6',
    name: 'Emergency Trauma Kit - Professional',
    subtitle: 'Complete First Response Kit',
    price: 85.50,
    rating: 4.7,
    reviewCount: 42,
    category: 'Surgical Equipment',
    categoryId: 'surgical',
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=300&fit=crop',
    inStock: true,
    description: 'Complete professional emergency trauma kit with all essential tools for first response. Includes suture kit, tourniquet, wound dressings, and more.',
    specifications: [
      { icon: '🩹', label: '45 Pieces' },
      { icon: '🎒', label: 'Carry Bag' },
      { icon: '⭐', label: 'ISO Certified' },
      { icon: '🛡️', label: 'Sterile' },
    ],
    howToUse: [
      'Assess the situation before opening kit.',
      'Use appropriate items for specific injury type.',
      'Follow first aid protocols for each item.',
    ],
    reviews: [
      { name: 'Mohammed S.', time: '3 weeks ago', text: 'Well organized, high quality components.', rating: 5 },
    ],
  },
  {
    id: 'p7',
    name: 'Surgical Face Masks (Pack of 50)',
    subtitle: '3-Layer Medical Grade',
    price: 15.00,
    rating: 4.6,
    reviewCount: 312,
    category: 'Protective Equipment',
    categoryId: 'protective',
    image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400&h=300&fit=crop',
    inStock: true,
    description: '3-layer medical-grade surgical face masks with high filtration efficiency. BFE ≥99%, suitable for clinical and daily use.',
    specifications: [
      { icon: '🛡️', label: '3-Layer' },
      { icon: '💨', label: 'BFE ≥99%' },
      { icon: '🎨', label: 'Blue/White' },
      { icon: '📦', label: 'Pack of 50' },
    ],
    howToUse: [
      'Wash hands before handling mask.',
      'Position colored side outward.',
      'Adjust nose wire for secure fit.',
    ],
    reviews: [
      { name: 'Nora H.', time: '4 days ago', text: 'Great quality for the price.', rating: 4 },
    ],
  },
  {
    id: 'p8',
    name: 'Smart Glucometer Kit',
    subtitle: 'Bluetooth Connected Glucose Monitor',
    price: 38.99,
    originalPrice: 55.00,
    rating: 4.8,
    reviewCount: 197,
    category: 'Diabetes Care',
    categoryId: 'diabetes',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop',
    inStock: true,
    description: 'Smart Bluetooth glucometer that syncs with your smartphone for comprehensive diabetes management. Includes 50 test strips and lancing device.',
    specifications: [
      { icon: '📱', label: 'Bluetooth' },
      { icon: '⚡', label: '5-Second Result' },
      { icon: '💾', label: '500 Memory' },
      { icon: '📊', label: 'App Sync' },
    ],
    howToUse: [
      'Insert test strip into glucometer.',
      'Prick fingertip with lancing device.',
      'Apply blood drop to test strip edge.',
    ],
    reviews: [
      { name: 'Yusuf A.', time: '1 week ago', text: 'The app integration is fantastic!', rating: 5 },
    ],
  },
];

export const mockOrders: Order[] = [
  {
    id: 'o1',
    orderId: '#ASH-987654',
    status: 'shipped',
    estimatedArrival: 'Mar 25, 2026',
    placedAt: 'Mar 18, 09:00 AM',
    items: [
      { name: 'Premium BP Monitor', price: 59.99, qty: 1 },
      { name: 'Surgical Face Masks', price: 15.00, qty: 1 },
    ],
    total: 77.17,
  },
  {
    id: 'o2',
    orderId: '#ASH-874321',
    status: 'delivered',
    estimatedArrival: 'Apr 10, 2026',
    placedAt: 'Apr 05, 11:00 AM',
    items: [
      { name: 'Infrared Thermometer', price: 45.50, qty: 1 },
    ],
    total: 47.75,
  },
];

export const bannerSlides = [
  {
    title: 'Discount on BP Monitoring Sets',
    subtitle: 'Up to 30% off on Omron series.',
    bg: 'linear-gradient(135deg, #1D4ED8, #0EA5E9)',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&h=180&fit=crop',
  },
  {
    title: 'New Arrivals: Surgical Kits',
    subtitle: 'Professional grade tools for clinics.',
    bg: 'linear-gradient(135deg, #059669, #10B981)',
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=300&h=180&fit=crop',
  },
  {
    title: 'Free Shipping on $50+',
    subtitle: 'All diagnostic devices included.',
    bg: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=180&fit=crop',
  },
];

export const quickCategories = [
  { id: 'diagnostic', label: 'BP Monitor', icon: '💓' },
  { id: 'diagnostic', label: 'Stethoscope', icon: '🩺' },
  { id: 'diabetes', label: 'Glucometer', icon: '💉' },
  { id: 'diagnostic', label: 'Thermometer', icon: '🌡️' },
  { id: 'protective', label: 'Surgical Gloves', icon: '🧤' },
  { id: 'protective', label: 'Nebulizer', icon: '💨' },
  { id: 'diagnostic', label: 'Pulse Ox', icon: '❤️' },
  { id: 'diagnostic', label: 'Diagnostic', icon: '🔬' },
];
