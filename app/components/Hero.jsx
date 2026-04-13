import {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Link} from 'react-router';

const HERO_SLIDES = [
  {
    image: '/images/loorea_hero_signature.png',
    title: 'LOOREA JEWELLERY',
    subtitle: 'SINCE 1996 | TALLINN',
    isRed: true,
    isWide: true,
  },
  {
    image: '/images/loorea_hero_rings.png',
    title: 'ARCHIVE',
    subtitle: 'COLLECTION 2024',
    isRed: false,
    isWide: false,
  },
  {
    image: '/images/loorea_hero_customize.png',
    title: 'CUSTOMIZE',
    subtitle: 'ATELIER SERVICES',
    isRed: false,
    isWide: false,
  },
  {
    image: '/images/loorea_hero_detail.png',
    title: 'FILIGREE',
    subtitle: 'THE ANCIENT ART',
    isRed: false,
    isWide: false,
  },
  {
    image: '/images/loorea_hero_kalendae.png',
    title: 'KALENDAE',
    subtitle: 'ASTRONOMICAL SERIES',
    isRed: false,
    isWide: false,
  }
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[index];

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100vw' : '-100vw',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100vw' : '-100vw',
      opacity: 0,
      transition: {
        duration: 2.2,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <section className="relative h-screen w-full bg-background overflow-hidden flex items-center justify-center">
      {/* SLIDING BACKGROUND STACK */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
           key={index}
           custom={direction}
           variants={variants}
           initial="enter"
           animate="center"
           exit="exit"
           transition={{
             x: { type: "spring", stiffness: 300, damping: 30 },
             opacity: { duration: 1.5 }
           }}
           className="absolute inset-0 w-full h-full"
        >
          {slide.isSplit ? (
            <div className="flex w-full h-full">
              <div className="w-1/2 h-full border-r border-white/5 overflow-hidden">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              </div>
              <div className="w-1/2 grid grid-rows-3 h-full">
                 <div className="border-b border-white/5 overflow-hidden">
                   <img src="/images/loorea_hero_rings.png" className="w-full h-full object-cover opacity-50 grayscale" alt="detail 1" />
                 </div>
                 <div className="border-b border-white/5 overflow-hidden">
                   <img src="/images/loorea_hero_customize.png" className="w-full h-full object-cover opacity-50 grayscale" alt="detail 2" />
                 </div>
                 <div className="overflow-hidden">
                   <img src="/images/loorea_hero_kalendae.png" className="w-full h-full object-cover opacity-50 grayscale" alt="detail 3" />
                 </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full overflow-hidden">
               <motion.img 
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "linear" }}
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* CENTRAL TYPOGRAPHY OVERLAY */}
      <div className="relative z-20 w-full flex items-center justify-center pointer-events-none h-full pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <h2 className={`select-none transition-colors duration-1000 ${slide.isWide ? 'text-hero-wide' : 'text-hero-giant'} ${slide.isRed ? 'text-accent' : 'text-white'} opacity-90`}>
              {slide.title}
            </h2>
            <div className="mt-8 md:mt-12 space-y-8">
              <h3 className="text-white text-sm md:text-xl font-serif italic tracking-[0.4em] uppercase opacity-60 drop-shadow-xl">
                {slide.subtitle}
              </h3>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 5-SEGMENT PROGRESS INDICATORS */}
      <div className="absolute bottom-12 right-12 md:bottom-24 md:right-24 z-30 flex items-end gap-12">
        <div className="progress-container">
          {HERO_SLIDES.map((_, i) => (
            <div key={i} className="progress-segment">
              <motion.div 
                animate={i === index ? { x: '0%' } : i < index ? { x: '0%' } : { x: '-100%' }}
                transition={i === index ? { duration: 8, ease: "linear" } : { duration: 0.5 }}
                className="progress-fill"
              />
            </div>
          ))}
        </div>
        <span className="text-[10px] tracking-[0.4em] font-medium opacity-30 text-white">
          0{index + 1} / 0{HERO_SLIDES.length}
        </span>
      </div>

      {/* CTA OVERLAY (Bottom Center) */}
      <div className="absolute bottom-12 md:bottom-24 left-1/2 -translate-x-1/2 z-30">
        <Link to="/collections/all" className="group flex flex-col items-center gap-6 pointer-events-auto">
           <div className="w-[1px] h-12 bg-white/40 group-hover:h-20 group-hover:bg-accent transition-all duration-700" />
           <span className="text-white text-[10px] uppercase tracking-[0.6em] font-medium opacity-60 group-hover:opacity-100 transition-opacity">
             Discover Archives
           </span>
        </Link>
      </div>
    </section>
  );
}
