import {motion} from 'framer-motion';
import {Link} from 'react-router';

const ZODIAC_SIGNS = [
  { name: 'Aries', talent: 'Courage', date: 'Mar 21 – Apr 19' },
  { name: 'Taurus', talent: 'Stability', date: 'Apr 20 – May 20' },
  { name: 'Gemini', talent: 'Versatility', date: 'May 21 – Jun 20' },
  { name: 'Cancer', talent: 'Devotion', date: 'Jun 21 – Jul 22' },
  { name: 'Leo', talent: 'Sovereignty', date: 'Jul 23 – Aug 22' },
  { name: 'Virgo', talent: 'Purity', date: 'Aug 23 – Sep 22' },
  { name: 'Libra', talent: 'Harmony', date: 'Sep 23 – Oct 22' },
  { name: 'Scorpio', talent: 'Intensity', date: 'Oct 23 – Nov 21' },
  { name: 'Sagittarius', talent: 'Wisdom', date: 'Nov 22 – Dec 21' },
  { name: 'Capricorn', talent: 'Ambition', date: 'Dec 22 – Jan 19' },
  { name: 'Aquarius', talent: 'Vision', date: 'Jan 20 – Feb 18' },
  { name: 'Pisces', talent: 'Intuition', date: 'Feb 19 – Mar 20' }
];

export function ZodiacDiscovery() {
  return (
    <section className="bg-foreground py-48 px-6 md:px-24">
      <div className="max-w-[140rem] mx-auto space-y-32">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-background/10 pb-16">
          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold">The Archive Discovery</span>
            <h2 className="text-background text-6xl md:text-8xl font-serif italic tracking-tighter leading-none">
              Find your celestial alignment
            </h2>
          </div>
          <p className="max-w-sm text-xs font-light text-background/40 leading-relaxed tracking-wide">
            Discover a curated collection of jewellery specifically balanced for your astrological signature. 
          </p>
        </div>

        {/* Interactive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-l border-t border-background/5">
          {ZODIAC_SIGNS.map((sign, idx) => (
            <Link 
              key={sign.name}
              to={`/collections/zodiac-${sign.name.toLowerCase()}`}
              className="group relative aspect-square border-r border-b border-background/5 p-8 flex flex-col items-center justify-between hover:bg-background/[0.02] transition-colors duration-700"
            >
              {/* Index Number */}
              <span className="absolute top-6 left-6 text-[9px] text-background/20 font-medium">0{idx + 1}</span>
              
              {/* Sign Visual (Placeholder for SVG/Icon) */}
              <div className="flex-1 flex items-center justify-center">
                 <motion.div 
                   whileHover={{ scale: 1.1, rotate: 5 }}
                   className="w-12 h-12 border border-accent/20 rounded-full flex items-center justify-center group-hover:border-accent transition-colors duration-700"
                 >
                    <span className="text-accent text-[10px] uppercase tracking-widest font-black opacity-40 group-hover:opacity-100">
                      {sign.name.substring(0, 3)}
                    </span>
                 </motion.div>
              </div>

              {/* Identity Overlay */}
              <div className="w-full text-center space-y-1">
                <h3 className="text-background text-[11px] uppercase tracking-[0.3em] font-medium group-hover:text-accent transition-colors">
                  {sign.name}
                </h3>
                <p className="text-[9px] text-background/40 italic font-light opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  {sign.talent}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Discovery Footer */}
        <div className="flex flex-col items-center gap-12 pt-12">
           <div className="h-[1px] w-48 bg-background/10" />
           <Link to="/collections/zodiac-all" className="group flex flex-col items-center gap-6">
              <span className="text-background text-[10px] uppercase tracking-[0.6em] font-medium opacity-40 group-hover:opacity-100 hover:text-accent transition-all">
                Explore the complete celestial collection
              </span>
              <div className="w-12 h-[1px] bg-accent transform scale-x-0 group-hover:scale-x-200 transition-transform duration-700" />
           </Link>
        </div>
      </div>
    </section>
  );
}
