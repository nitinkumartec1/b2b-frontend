'use client';
import { motion } from 'framer-motion';
import SafeImage from '@/components/SafeImage';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { resolveImage } from '@/lib/imageResolver';

const premiumDestinations = [
  { name: 'Kashmir', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80' },
  { name: 'Goa', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80' },
  { name: 'Meghalaya', img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80' },
  { name: 'Ladakh', img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80' },
  { name: 'Bali', img: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&q=80' },
  { name: 'Dubai', img: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80' },
  { name: 'Thailand', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80' },
  { name: 'Maldives', img: 'https://images.unsplash.com/photo-1433083866827-44b205312f2a?w=600&q=80' }
];

export default function PreviewCards() {
  return (
    <section className="container-x py-16">
      <div className="flex flex-col items-center text-center mb-12">
        <span className="text-accent font-extrabold tracking-widest uppercase text-sm mb-2">Explore the World</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Premium Destinations</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {premiumDestinations.map((dest, i) => (
          <Link href={`/packages?q=${dest.name}`} key={dest.name}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative h-[250px] md:h-[300px] rounded-[24px] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-12px_rgba(30,77,139,0.2)] transition-shadow duration-300"
            >
              <SafeImage 
                src={resolveImage('destination', dest.name, dest.img)} 
                alt={dest.name} 
                fill 
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white text-xl md:text-2xl font-bold flex items-center gap-2 drop-shadow-md">
                  <MapPin size={20} className="text-accent" /> {dest.name}
                </h3>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
