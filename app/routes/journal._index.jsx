import {motion} from 'framer-motion';

export const meta = () => {
  return [{title: 'Journal | Loorea Jewellery'}];
};

const ARTICLES = [
  {
    id: 1,
    title: 'The Alchemist\'s Touch: Defining Estonian Filigree',
    category: 'Craftsmanship',
    date: 'April 12, 2024',
    excerpt: 'In the quiet hours of the Tallinn dawn, the silver begins to speak. We uncover the meditative process behind our signature filigree, where each thread is a testament to patience and the preservation of an ancient Baltic heritage.',
    image: '/images/gallery_threads.png'
  },
  {
    id: 2,
    title: 'Celestial Cartography: Mapping the Zodiac',
    category: 'Collections',
    date: 'March 28, 2024',
    excerpt: 'How do you capture the orientation of the stars in a single gram of gold? Our lead designer takes us through the astronomical research that informed the "Celestial Alignment" series.',
    image: '/images/gallery_roots.png'
  },
  {
    id: 3,
    title: 'Minimalism as a Language of Power',
    category: 'Philosophy',
    date: 'February 15, 2024',
    excerpt: 'Exploring the architectural restraint that defines the LOOREA aesthetic. Why the space between the silver threads is just as important as the metal itself.',
    image: '/images/gallery_ephemeral.png'
  }
];

export default function Journal() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-48">
      <div className="max-w-[140rem] mx-auto px-6 md:px-24 space-y-32">
        {/* Editorial Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-foreground/5 pb-16">
          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold">The Journal</span>
            <h1 className="text-7xl md:text-[10rem] font-serif italic tracking-tighter leading-none">
              Stories of <br/> Craft & Sky
            </h1>
          </div>
          <p className="max-w-sm text-xs font-light text-foreground/40 leading-relaxed tracking-wide">
            A chronicle of our atelier's quest for celestial harmony and the preservation of ancient Estonian silversmithing.
          </p>
        </header>

        {/* Article Grid */}
        <div className="space-y-48">
          {ARTICLES.map((article, idx) => (
            <motion.article 
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 md:gap-24 items-center`}
            >
              <div className="w-full md:w-1/2 aspect-[4/5] overflow-hidden bg-muted">
                 <img src={article.image} alt={article.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-[4s] ease-linear" />
              </div>
              <div className="w-full md:w-1/2 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.4em] font-bold text-accent">
                    <span>{article.category}</span>
                    <span className="h-[1px] w-8 bg-accent/20" />
                    <span className="text-foreground/30">{article.date}</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-serif italic tracking-tighter leading-none">
                    {article.title}
                  </h2>
                </div>
                <p className="text-sm font-light text-foreground/60 leading-relaxed max-w-md">
                   {article.excerpt}
                </p>
                <button className="text-[10px] uppercase tracking-[0.6em] font-medium border-b border-foreground/10 pb-2 hover:border-accent transition-colors">
                  Enter the story
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
