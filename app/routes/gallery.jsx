import {motion} from 'framer-motion';
import {useState} from 'react';
import {ArrowRight} from 'lucide-react';
import {clsx} from 'clsx';

export const meta = () => {
  return [{title: 'Gallery Seasons | Loorea Jewellery'}];
};

const SEASONS = [
  { 
    id: 1, 
    name: 'Ephemeral Light', 
    year: '2024',
    image: '/images/gallery_ephemeral.png',
    description: 'A collection inspired by the fleeting moments of dawn and sunset in the Baltic atelier.'
  },
  { 
    id: 2, 
    name: 'Silver Threads', 
    year: '2023',
    image: '/images/gallery_threads.png',
    description: 'The geometric strength of connection woven into fine silver filigree.'
  },
  { 
    id: 3, 
    name: 'Ancestral Roots', 
    year: '2023',
    image: '/images/gallery_roots.png',
    description: 'Honoring the ancient techniques of Estonian silversmiths passed through generations.'
  },
];

export default function Gallery() {
  return (
    <div className="min-h-screen bg-background pt-44 pb-32">
      <div className="max-w-[1440px] mx-auto px-6 md:px-24">
        {/* EDITORIAL HEADER */}
        <header className="mb-32 max-w-2xl">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.6em] text-accent font-bold"
          >
            Curated Archives
          </motion.span>
          <h1 className="text-editorial-title mt-6 mb-8">Seasonal Gallery</h1>
          <p className="text-xs font-light text-foreground/40 leading-relaxed tracking-wider max-w-sm">
            A visual dialogue between ancient silversmithing traditions and the fleeting light of the Baltic seasons.
          </p>
        </header>

        {/* ASYMMETRIC STAGGERED GRID */}
        <div className="space-y-64 md:space-y-96">
          {SEASONS.map((season, idx) => (
            <GallerySection key={season.id} season={season} idx={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}

function GallerySection({season, idx}) {
  const isEven = idx % 2 === 0;

  return (
    <div className={clsx(
      "relative flex flex-col md:flex-row items-center gap-12 md:gap-24",
      !isEven && "md:flex-row-reverse"
    )}>
      {/* FLOATING METADATA ANCHOR */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={clsx(
          "absolute -top-12 z-20 hidden lg:block",
          isEven ? "-left-12" : "-right-12"
        )}
      >
        <div className="flex flex-col items-center gap-6">
          <span className="[writing-mode:vertical-lr] text-[9px] uppercase tracking-[0.8em] text-foreground/20 font-medium rotate-180">
            {season.year} Collection
          </span>
          <div className="w-[1px] h-24 bg-accent/30" />
        </div>
      </motion.div>

      {/* PRIMARY IMAGE CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className={clsx(
          "relative w-full md:w-2/3 overflow-hidden rounded-xs bg-muted",
          idx === 1 ? "aspect-[4/3]" : "aspect-[3/4]"
        )}
      >
        <img 
          src={season.image} 
          alt={season.name} 
          className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-[1.02] ease-linear"
        />
        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
      </motion.div>

      {/* EDITORIAL CONTENT CARD */}
      <div className={clsx(
        "w-full md:w-1/3 space-y-10",
        isEven ? "md:pt-32" : "md:pb-32"
      )}>
        <motion.div
           initial={{ opacity: 0, x: isEven ? 30 : -30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1.2, delay: 0.3 }}
           className="space-y-6"
        >
          <h2 className="text-5xl md:text-7xl font-serif italic tracking-tighter leading-none">
            {season.name}
          </h2>
          <p className="text-sm font-light text-foreground/60 leading-relaxed italic max-w-xs">
            {season.description}
          </p>
        </motion.div>

        <div className="flex items-center gap-6 group cursor-pointer w-fit pt-4">
          <div className="w-12 h-[1px] bg-accent transition-all duration-700 group-hover:w-24" />
          <span className="text-[10px] uppercase tracking-[0.4em] font-medium opacity-60 group-hover:opacity-100 group-hover:text-accent transition-all">
            Explore Series
          </span>
        </div>
      </div>
    </div>
  );
}
