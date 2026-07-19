'use client';
import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TourCard from './TourCard';

export default function TourSlider({ items }: { items: any[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => { if (emblaApi) emblaApi.scrollPrev(); }, [emblaApi]);
  const scrollNext = useCallback(() => { if (emblaApi) emblaApi.scrollNext(); }, [emblaApi]);
  const scrollTo = useCallback((index: number) => { if (emblaApi) emblaApi.scrollTo(index); }, [emblaApi]);

  const onInit = useCallback(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onInit();
    onSelect();
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return (
    <div className="relative group px-2 md:px-0">
      <div className="overflow-hidden py-4" ref={emblaRef}>
        <div className="flex -ml-4 md:-ml-[28px]">
          {items.map((p) => (
            <div key={p._id} className="pl-4 md:pl-[28px] min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.3333%] xl:flex-[0_0_25%]">
              <TourCard pkg={p} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Arrows */}
      <button onClick={scrollPrev} className="absolute -left-5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-3 shadow-premium transition-all hover:scale-110 opacity-0 group-hover:opacity-100 dark:bg-slate-800 hidden md:flex items-center justify-center border border-slate-100 dark:border-slate-700 text-primary hover:bg-primary hover:text-white">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={scrollNext} className="absolute -right-5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-3 shadow-premium transition-all hover:scale-110 opacity-0 group-hover:opacity-100 dark:bg-slate-800 hidden md:flex items-center justify-center border border-slate-100 dark:border-slate-700 text-primary hover:bg-primary hover:text-white">
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${index === selectedIndex ? 'bg-primary w-8' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 w-2.5'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
