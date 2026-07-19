'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, MapPin, CalendarDays, Users } from 'lucide-react';
import SearchField from './SearchField';

export default function SearchContainer() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2 Adults, 1 Room');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set('q', destination);
    router.push(`/packages?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-[1200px] mx-auto bg-white/90 backdrop-blur-xl rounded-[24px] p-6 md:p-8 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] border border-slate-200/50 relative z-30 -mt-16 mb-16"
    >
      <form onSubmit={handleSearch}>
        
        {/* Search Fields Row */}
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <SearchField 
            label="Destination"
            icon={<MapPin size={20} />} 
            placeholder="Where do you want to go?" 
            value={destination} 
            onChange={setDestination} 
          />
          <div className="w-full lg:w-[1px] h-[1px] lg:h-12 bg-slate-200 my-2 lg:my-0 shrink-0" />
          <SearchField 
            label="Check In"
            icon={<CalendarDays size={20} />} 
            type="date"
            value={checkIn} 
            onChange={setCheckIn} 
          />
          <div className="w-full lg:w-[1px] h-[1px] lg:h-12 bg-slate-200 my-2 lg:my-0 shrink-0" />
          <SearchField 
            label="Check Out"
            icon={<CalendarDays size={20} />} 
            type="date"
            value={checkOut} 
            onChange={setCheckOut} 
          />
          <div className="w-full lg:w-[1px] h-[1px] lg:h-12 bg-slate-200 my-2 lg:my-0 shrink-0" />
          <SearchField 
            label="Guests & Rooms"
            icon={<Users size={20} />} 
            placeholder="2 Adults, 1 Room" 
            value={guests} 
            onChange={setGuests} 
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full lg:w-auto mt-4 lg:mt-0 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-10 py-5 lg:py-4 rounded-[16px] font-bold text-[18px] flex items-center justify-center gap-2 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.6)] transition-all shrink-0 h-[64px]"
          >
            <Search size={22} /> Search
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
