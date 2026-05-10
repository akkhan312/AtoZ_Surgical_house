'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiActivity, FiScissors, FiDroplet, FiHome, FiShield, FiCpu, FiChevronRight } from 'react-icons/fi';
import { MdOutlineBiotech, MdOutlineLocalHospital } from 'react-icons/md';

const CATEGORIES = [
  { id: 'diagnostic',   name: 'Diagnostic Equipment',  desc: 'BP monitors, stethoscopes, pulse oximeters',        icon: <FiActivity size={24} /> },
  { id: 'surgical',     name: 'Surgical Instruments',   desc: 'Forceps, scissors, retractors, full surgical kits',  icon: <FiScissors size={24} /> },
  { id: 'patient-care', name: 'Patient Care',           desc: 'Infusion stands, wheelchairs, walkers',              icon: <MdOutlineLocalHospital size={24} /> },
  { id: 'diabetes',     name: 'Diabetes Care',          desc: 'Glucose meters, lancets, insulin pens',              icon: <FiDroplet size={24} /> },
  { id: 'furniture',    name: 'Medical Furniture',      desc: 'Hospital beds, exam tables, cabinets',               icon: <FiHome size={24} /> },
  { id: 'protective',   name: 'Protective Equipment',   desc: 'Gloves, masks, gowns, PPE kits',                    icon: <FiShield size={24} /> },
  { id: 'lab',          name: 'Lab Equipment',          desc: 'Microscopes, centrifuges, specimen containers',       icon: <MdOutlineBiotech size={24} /> },
  { id: 'monitors',     name: 'Patient Monitors',       desc: 'Cardiac monitors, SpO2, multi-parameter systems',    icon: <FiCpu size={24} /> },
];

export default function CategoriesPage() {
  const [q, setQ] = useState('');
  const filtered = CATEGORIES.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) || c.desc.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        {/* Search */}
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-5 py-3 mb-6 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <FiSearch size={18} className="text-gray-400 shrink-0" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search medical categories..." className="flex-1 text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-black text-gray-900">All Categories</h1>
          <span className="text-sm font-semibold text-blue-600">{filtered.length} found</span>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {filtered.map(cat => (
            <Link key={cat.id} href={`/categories/${cat.id}`}
              className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 hover:border-blue-300 hover:shadow-md hover:translate-x-1 transition-all group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-100 shrink-0">
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-base mb-0.5">{cat.name}</p>
                <p className="text-sm text-gray-500 truncate">{cat.desc}</p>
              </div>
              <FiChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
