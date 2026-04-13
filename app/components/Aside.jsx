import {createContext, useContext, useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

/**
 * A side bar component that can be used for navigation, cart, etc.
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 * </Aside>
 * ```
 */
export function Aside({children, heading, type}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [expanded]);

  return (
    <AnimatePresence>
      {expanded && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm cursor-default"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-screen max-w-md h-full bg-[#EEEEEE] shadow-[-50px_0_100px_rgba(0,0,0,0.05)] border-l border-foreground/5 flex flex-col"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-12 border-b border-foreground/5">
              <h2 className="text-3xl font-serif italic tracking-tighter uppercase">{heading}</h2>
              <button 
                onClick={close}
                className="group flex flex-col items-end gap-1.5"
                aria-label="Close"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 group-hover:opacity-100 transition-opacity">Close</span>
                <div className="w-6 h-[1px] bg-foreground/20 group-hover:w-8 group-hover:bg-foreground transition-all duration-500" />
              </button>
            </header>

            {/* Content Container */}
            <main className="flex-1 overflow-y-auto px-8 py-12 custom-scrollbar">
              {children}
            </main>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

const AsideContext = createContext(null);

Aside.Provider = function AsideProvider({children}) {
  const [type, setType] = useState('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const context = useContext(AsideContext);
  if (!context) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return context;
}
