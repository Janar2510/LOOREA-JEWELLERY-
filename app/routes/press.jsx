import {motion} from 'framer-motion';

export const meta = () => {
  return [{title: 'Press Archive | Loorea Jewellery'}];
};

const PRESS_CLIPS = [
  {
    outlet: 'Vogue',
    title: 'The New Era of Silver: Loorea’s Celestial Vision',
    date: 'Autumn 2024',
    image: '/images/press_vogue.png'
  },
  {
    outlet: 'AD',
    title: 'Jewellery as Architecture: Inside the Tallinn Atelier',
    date: 'Summer 2024',
    image: '/images/gallery_threads.png'
  },
  {
    outlet: 'Bazaar',
    title: 'Top 10 Artisanal Brands of Northern Europe',
    date: 'Winter 2023',
    image: '/images/gallery_roots.png'
  }
];

export default function Press() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-64">
      <div className="max-w-[140rem] mx-auto px-6 md:px-24 space-y-32">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-foreground/5 pb-16">
          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold">Media Presence</span>
            <h1 className="text-7xl md:text-[10rem] font-serif italic tracking-tighter leading-none">
              Press <br/> Archives
            </h1>
          </div>
          <p className="max-w-sm text-xs font-light text-foreground/40 leading-relaxed tracking-wide">
            Recognition and features across global editorial platforms, celebrating our unique fusion of heritage and avant-garde design.
          </p>
        </header>

        {/* Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-24">
           {PRESS_CLIPS.map((clip, idx) => (
             <motion.div 
               key={clip.title}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
               className="group space-y-8"
             >
                <div className="aspect-[3/4] overflow-hidden bg-muted shadow-2xl group-hover:-translate-y-4 transition-transform duration-1000">
                   <img src={clip.image} alt={clip.title} className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000" />
                </div>
                <div className="space-y-4">
                   <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.4em] font-bold text-accent">
                      <span>{clip.outlet}</span>
                      <span className="text-foreground/20">{clip.date}</span>
                   </div>
                   <h2 className="text-2xl font-serif italic leading-tight text-foreground/80 group-hover:text-foreground transition-colors">
                     {clip.title}
                   </h2>
                   <button className="text-[9px] uppercase tracking-[0.6em] font-medium border-b border-foreground/10 pb-1 hover:border-accent transition-colors">
                     View Article
                   </button>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
}
