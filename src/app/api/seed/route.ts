import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Product from '@/models/Product';

const seedProducts = [
  {
    name: 'Precision Digital BP Monitor',
    subtitle: 'Professional Upper Arm Blood Pressure Monitor',
    description: 'A clinically validated blood pressure monitor with large LCD display, memory for 60 readings, and WHO blood pressure classification indicator. Ideal for home and clinical use.',
    price: 49.99,
    originalPrice: 79.99,
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop',
    category: 'Diagnostic Equipment',
    categoryId: 'diagnostic',
    rating: 4.8,
    reviewCount: 324,
    inStock: true,
    featured: true,
    specifications: [
      { icon: 'battery', label: 'Battery: 4x AA' },
      { icon: 'monitor', label: 'LCD Display' },
      { icon: 'memory', label: 'Memory: 60 readings' },
      { icon: 'clock', label: 'Auto Shut-off' },
    ],
    howToUse: [
      'Sit comfortably with feet flat on the floor.',
      'Wrap the cuff around your upper arm 2cm above the elbow.',
      'Press the START button and remain still.',
      'The reading will display in 30 seconds.',
    ],
    reviews: [
      { name: 'Dr. Sarah M.', time: '2 weeks ago', text: 'Highly accurate and easy to use. Recommend for all patients.', rating: 5 },
      { name: 'John K.', time: '1 month ago', text: 'Great build quality, battery life is excellent.', rating: 4 },
    ],
  },
  {
    name: 'Professional Stethoscope',
    subtitle: 'Dual-Head Cardiology Stethoscope',
    description: 'High-performance stethoscope with a dual-head chestpiece and patented tunable diaphragm for adult and pediatric use. Superior acoustics for reliable auscultation.',
    price: 89.99,
    originalPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
    category: 'Diagnostic Equipment',
    categoryId: 'diagnostic',
    rating: 4.9,
    reviewCount: 512,
    inStock: true,
    featured: true,
    specifications: [
      { icon: 'headphones', label: 'Dual-Head' },
      { icon: 'shield', label: 'Latex-Free' },
      { icon: 'zap', label: 'Tunable Diaphragm' },
      { icon: 'award', label: 'CE Certified' },
    ],
    howToUse: [
      'Insert the earpieces pointing forward toward your ears.',
      'Place the diaphragm on the patient chest firmly.',
      'Apply light pressure for high-frequency sounds.',
      'Use the bell side for low-frequency sounds.',
    ],
    reviews: [
      { name: 'Dr. Anas R.', time: '3 days ago', text: 'Best stethoscope I have ever owned. Crystal clear acoustics.', rating: 5 },
      { name: 'Nurse Priya', time: '2 weeks ago', text: 'Comfortable and very durable.', rating: 5 },
    ],
  },
  {
    name: 'Surgical Gloves (Box of 100)',
    subtitle: 'Sterile Latex Examination Gloves',
    description: 'Premium powder-free latex gloves that provide excellent protection and tactile sensitivity. Suitable for surgical procedures and patient examination.',
    price: 19.99,
    originalPrice: 28.00,
    image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400&h=300&fit=crop',
    category: 'Protective Equipment',
    categoryId: 'protective',
    rating: 4.6,
    reviewCount: 891,
    inStock: true,
    featured: true,
    specifications: [
      { icon: 'package', label: 'Box of 100' },
      { icon: 'shield', label: 'Powder-Free' },
      { icon: 'check', label: 'Sterile' },
      { icon: 'star', label: 'ISO Certified' },
    ],
    howToUse: [
      'Wash and dry your hands thoroughly before gloving.',
      'Pull glove over your hand ensuring full coverage.',
      'Inspect for tears or defects before use.',
      'Remove by peeling back from the wrist turning inside-out.',
    ],
    reviews: [
      { name: 'Dr. Karim', time: '1 week ago', text: 'Good quality and snug fit. No tearing during procedures.', rating: 5 },
    ],
  },
  {
    name: 'Glucose Meter Kit',
    subtitle: 'Smart Blood Glucose Monitoring System',
    description: 'Advanced glucose meter with a large backlit display, fast 5-second test results, and 500-reading memory. Compatible with the smartphone app for trend tracking.',
    price: 34.99,
    originalPrice: 55.00,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=300&fit=crop',
    category: 'Diabetes Care',
    categoryId: 'diabetes',
    rating: 4.7,
    reviewCount: 267,
    inStock: true,
    featured: true,
    specifications: [
      { icon: 'zap', label: '5-Second Results' },
      { icon: 'database', label: '500 Reading Memory' },
      { icon: 'smartphone', label: 'App Compatible' },
      { icon: 'droplet', label: '0.5µL Sample' },
    ],
    howToUse: [
      'Insert a test strip into the meter.',
      'Prick the fingertip with the lancet.',
      'Touch the blood drop to the test strip edge.',
      'Read the result in 5 seconds.',
    ],
    reviews: [
      { name: 'Maria L.', time: '5 days ago', text: 'Very easy to use. App integration works great.', rating: 5 },
      { name: 'Tom H.', time: '3 weeks ago', text: 'Accurate readings, great value for money.', rating: 4 },
    ],
  },
  {
    name: 'Hospital Bed (Electric)',
    subtitle: '3-Function Electric Hospital Bed with Rails',
    description: 'Full-electric medical bed with three adjustable positions, built-in side rails, and heavy-duty steel frame. Ideal for home care and rehabilitation facilities.',
    price: 1299.00,
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop',
    category: 'Medical Furniture',
    categoryId: 'furniture',
    rating: 4.5,
    reviewCount: 112,
    inStock: true,
    specifications: [
      { icon: 'monitor', label: '3-Function Electric' },
      { icon: 'shield', label: 'Side Rails' },
      { icon: 'box', label: 'Steel Frame' },
      { icon: 'users', label: '250kg Capacity' },
    ],
    howToUse: [
      'Assemble per the included instruction manual.',
      'Plug into a standard 110-220V outlet.',
      'Use the hand control to adjust head, foot and height.',
      'Lock the wheel brakes when stationary.',
    ],
    reviews: [
      { name: 'Care Facility Mgr.', time: '1 month ago', text: 'Sturdy and easy to operate. Our patients love it.', rating: 5 },
    ],
  },
  {
    name: 'Infusion Stand (IV Pole)',
    subtitle: 'Adjustable 5-Wheel Stainless Steel IV Stand',
    description: 'Heavy-duty stainless steel IV pole with two hooks and a five-caster wheeled base for easy mobility. Adjustable height from 130cm to 200cm.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
    category: 'Patient Care',
    categoryId: 'patient-care',
    rating: 4.4,
    reviewCount: 189,
    inStock: true,
    specifications: [
      { icon: 'layers', label: 'Stainless Steel' },
      { icon: 'move', label: 'Adjustable Height' },
      { icon: 'circle', label: '5 Caster Wheels' },
      { icon: 'link', label: 'Dual Hooks' },
    ],
    howToUse: [
      'Unfold and lock the base casters.',
      'Adjust pole height using the tension knob.',
      'Hang IV bags on either hook.',
      'Ensure the bag is above patient level.',
    ],
    reviews: [
      { name: 'Nurse Ali', time: '2 weeks ago', text: 'Great product. Smooth-rolling wheels and sturdy build.', rating: 5 },
    ],
  },
  {
    name: 'Surgical Face Masks (Pack of 50)',
    subtitle: '3-Layer Disposable Medical Face Masks',
    description: 'High-filtration 3-ply disposable face masks with adjustable nose wire and soft elastic ear loops. Suitable for both medical and daily protection.',
    price: 15.00,
    originalPrice: 22.00,
    image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400&h=300&fit=crop',
    category: 'Protective Equipment',
    categoryId: 'protective',
    rating: 4.5,
    reviewCount: 1240,
    inStock: true,
    featured: true,
    specifications: [
      { icon: 'layers', label: '3-Layer Filter' },
      { icon: 'package', label: 'Pack of 50' },
      { icon: 'shield', label: 'BFE >95%' },
      { icon: 'check', label: 'CE Certified' },
    ],
    howToUse: [
      'Hold mask by the ear loops.',
      'Place over nose and mouth.',
      'Adjust nose wire for a secure fit.',
      'Replace every 8 hours or when moist.',
    ],
    reviews: [
      { name: 'Dr. Hana', time: '1 week ago', text: 'Comfortable and reliable. We use these daily at our clinic.', rating: 5 },
    ],
  },
  {
    name: 'Surgical Scissors Set',
    subtitle: 'Premium Stainless Steel 4-Piece Set',
    description: 'Professional-grade 4-piece surgical scissors set made from premium German stainless steel. Autoclavable and designed for precision cutting.',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop',
    category: 'Surgical Instruments',
    categoryId: 'surgical',
    rating: 4.8,
    reviewCount: 345,
    inStock: true,
    featured: true,
    specifications: [
      { icon: 'tool', label: 'German Steel' },
      { icon: 'thermometer', label: 'Autoclavable' },
      { icon: 'package', label: '4-Piece Set' },
      { icon: 'shield', label: 'ISO Certified' },
    ],
    howToUse: [
      'Sterilize before and after each use.',
      'Hold in dominant hand with fingers in rings.',
      'Use appropriate scissor for tissue type.',
      'Oil joints monthly to prevent stiffness.',
    ],
    reviews: [
      { name: 'Dr. Farid', time: '3 weeks ago', text: 'Perfect precision. These are the best scissors I have used.', rating: 5 },
    ],
  },
];

export async function GET() {
  try {
    await dbConnect();
    const count = await Product.countDocuments();
    if (count > 0) {
      return NextResponse.json({ message: `DB already has ${count} products. Skipping seed.` });
    }
    await Product.insertMany(seedProducts);
    return NextResponse.json({ message: `Seeded ${seedProducts.length} products successfully.` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
