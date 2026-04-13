import {motion} from 'framer-motion';

export const meta = () => {
  return [{title: 'News | Loorea Jewellery'}];
};

const NEWS_ITEMS = [
  {
    id: 1,
    title: 'The "Zodiac Series" is Live',
    date: 'April 2024',
    highlight: 'New Arrival',
    image: '/images/zodiac_ring.png'
  },
  {
    id: 2,
    title: 'Opening: The Tallinn Atelier',
    date: 'March 2024',
    highlight: 'Boutique',
    image: '/images/loorea_hero_detail.png'
  }
];

export default function News() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-48">
      <div className="max-w-[140rem] mx-auto px-6 md:px-24 space-y-24">
        <header className="space-y-6 max-w-2xl">
          <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold">Newsroom</span>
          <h1 className="text-7xl md:text-[10rem] font-serif italic tracking-tighter leading-none">
            Archives <br/> & Drops
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/5 border border-foreground/5">
           {NEWS_ITEMS.map((item) => (
             <motion.div 
               key={item.id}
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               className="bg-background p-12 md:p-24 space-y-12 flex flex-col justify-between"
             >
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <span className="text-[9px] uppercase tracking-[0.4em] font-medium text-accent">{item.highlight}</span>
                      <span className="text-[9px] text-foreground/30 uppercase tracking-[0.4em]">{item.date}</span>
                   </div>
                   <h2 className="text-4xl md:text-6xl font-serif italic tracking-tighter">{item.title}</h2>
                </div>
                <div className="aspect-video overflow-hidden bg-muted">
                   <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                </div>
                <button className="self-start text-[10px] uppercase tracking-[0.4em] font-medium opacity-40 hover:opacity-100 transition-opacity">
                  Read Announcement
                </button>
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
}
