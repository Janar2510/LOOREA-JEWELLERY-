import {motion, AnimatePresence} from 'framer-motion';
import {useState} from 'react';
import {Sparkles, Repeat} from 'lucide-react';
import {clsx} from 'clsx';

export const meta = () => {
  return [{title: 'Oracle Cards | Loorea Jewellery'}];
};

const CARDS = [
  { id: 1, title: 'Devotion', message: 'Your path is guided by the light of your own heart.' },
  { id: 2, title: 'Creation', message: 'Every piece of your journey is a work of art.' },
  { id: 3, title: 'Connection', message: 'The silver threads of destiny bind all souls together.' },
  { id: 4, title: 'Silence', message: 'In the quiet, the most profound truths are whispered.' },
  { id: 5, title: 'Radiance', message: 'Your inner light outshines any gemstone.' },
  { id: 6, title: 'Resilience', message: 'Like gold, you are refined through the fire.' },
];

export default function OracleCards() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsFlipped(true);
  };

  const reset = () => {
    setSelectedCard(null);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 pb-20 overflow-hidden relative">
      {/* Ethereal backgrounds */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="content-center relative z-10">
        <div className="text-center max-w-xl mx-auto space-y-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Sparkles className="mx-auto text-accent mb-4" size={24} strokeWidth={1} />
            <h1 className="text-5xl font-serif tracking-tight">The Oracle</h1>
            <p className="text-sm font-sans font-extralight tracking-[0.2em] text-white/50 uppercase pt-2">
              Draw a card for your journey
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
          {CARDS.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -10 }}
              onClick={() => handleCardClick(card)}
              className="group cursor-pointer aspect-[3/4] relative"
            >
              <div className="absolute inset-0 border border-white/10 rounded-sm glass-dark transition-colors group-hover:border-accent/30 flex items-center justify-center">
                <div className="w-12 h-12 border border-accent/20 rounded-full flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                   <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Card Detail Modal / Overlay */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 360 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md aspect-[3/4.5] glass-dark border border-accent/30 rounded-lg p-12 text-center flex flex-col items-center justify-center space-y-8"
            >
              <div className="absolute top-6 right-6">
                 <button onClick={reset} className="text-white/40 hover:text-white transition-colors">
                   <X size={24} strokeWidth={1} />
                 </button>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-medium">Message Received</span>
                <h2 className="text-4xl font-serif tracking-tight">{selectedCard.title}</h2>
              </div>

              <div className="w-8 h-[1px] bg-accent/30" />

              <p className="text-xl font-serif italic text-white/80 leading-relaxed text-balance">
                "{selectedCard.message}"
              </p>

              <div className="pt-8">
                <button
                  onClick={reset}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-medium text-white/60 hover:text-accent transition-colors"
                >
                  <Repeat size={14} strokeWidth={1} />
                  Draw Another
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function X({size, strokeWidth, className}) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
