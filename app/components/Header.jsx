import {Suspense, useState} from 'react';
import {Await, NavLink, Link} from 'react-router';
import {useAside} from '~/components/Aside';
import {motion, AnimatePresence} from 'framer-motion';

export function Header({header, cart}) {
  const [activeMenu, setActiveMenu] = useState(null);

  const navItems = [
    {title: 'BOUTIQUE', url: '/collections/all', hasMega: true},
    {title: 'About', url: '/pages/about'},
    {title: 'Gallery', url: '/gallery'},
    {title: 'Journal', url: '/journal'},
    {title: 'News', url: '/news'},
    {title: 'Press', url: '/press'},
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-foreground/5 h-20 transition-all duration-300">
      <div className="grid grid-cols-12 items-center h-full px-12 md:px-24">
        
        {/* LEFT: PRIMARY NAV */}
        <nav className="col-span-4 flex items-center gap-10">
          {navItems.map((item) => (
            <div 
              key={item.title}
              onMouseEnter={() => item.hasMega && setActiveMenu('item')}
              onMouseLeave={() => setActiveMenu(null)}
              className="relative h-20 flex items-center"
            >
              <NavLink
                to={item.url}
                className={({isActive}) => `
                  text-[11px] uppercase tracking-[0.2em] font-medium transition-colors
                  ${isActive ? 'text-accent' : 'hover:text-accent'}
                `}
              >
                {item.title}
              </NavLink>
              
              {/* MEGA MENU: ITEM */}
              {item.hasMega && (
                <AnimatePresence>
                  {activeMenu === 'item' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                      animate={{ opacity: 1, y: 0, scaleY: 1 }}
                      exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                      className="absolute top-20 left-[-24px] w-[600px] bg-background shadow-2xl border border-foreground/5 px-12 py-16 grid grid-cols-2 gap-16"
                    >
                      {/* Column 1: Category */}
                      <div className="space-y-8">
                        <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent">Style</h4>
                        <div className="flex flex-col gap-2">
                          {['ALL', 'RANKING', 'NECKLACE', 'PIERCE', 'EAR CUFF', 'RING', 'BRACELET', 'CHARM', 'OTHER', 'CUSTOMIZE'].map(cat => (
                            <Link key={cat} to={`/collections/${cat.toLowerCase().replace(' ', '-')}`} className="mega-menu-link">
                              {cat}
                            </Link>
                          ))}
                        </div>
                      </div>
                      
                      {/* Column 2: Collection */}
                      <div className="space-y-8">
                        <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent">Collection</h4>
                        <div className="flex flex-col gap-2">
                          {['ZODIAC', 'SIGN', 'PLANET', 'COSMIC GEM', 'ROYALSTAR', 'KALENDAE', 'STONE', 'NEW SEASON'].map(col => (
                            <Link key={col} to={`/collections/${col.toLowerCase().replace(' ', '-')}`} className="mega-menu-link">
                              {col}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>

        {/* CENTER: LOGO */}
        <div className="col-span-4 flex justify-center">
          <Link to="/" className="group flex flex-col items-center gap-1">
             <span className="text-xl font-serif italic tracking-tighter group-hover:text-accent transition-colors duration-700">Loorea</span>
             <span className="text-[8px] uppercase tracking-[0.6em] font-medium opacity-40 group-hover:opacity-100 transition-opacity duration-700">Jewellery</span>
          </Link>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="col-span-4 flex items-center justify-end gap-10">
          <HeaderSearchToggle />
          <a href="https://loorea-jewellery.myshopify.com/account/login" className="text-[11px] uppercase tracking-[0.2em] font-medium hover:text-accent transition-colors">Login</a>
          <HeaderWishlistToggle />
          <CartToggle cart={cart} />
        </div>
      </div>
    </header>
  );
}

function HeaderSearchToggle() {
  const {open} = useAside();
  return (
    <button onClick={() => open('search')} className="p-2 opacity-50 hover:opacity-100 transition-opacity">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
    </button>
  );
}

function HeaderWishlistToggle() {
  return (
    <button className="text-[11px] uppercase tracking-[0.2em] font-medium hover:text-accent transition-colors">
      Wishlist(0)
    </button>
  );
}

function CartToggle({cart}) {
  const {open} = useAside();
  return (
    <Suspense fallback={<button onClick={() => open('cart')} className="text-[11px] uppercase tracking-[0.2em] font-medium">Cart(0)</button>}>
      <Await resolve={cart}>
        {(cart) => (
          <button onClick={() => open('cart')} className="text-[11px] uppercase tracking-[0.2em] font-medium group flex items-center gap-1">
            <span className="group-hover:text-accent transition-colors">Cart({cart?.totalQuantity || 0})</span>
          </button>
        )}
      </Await>
    </Suspense>
  );
}

/**
 * Empty functions to satisfy PageLayout imports if needed
 */
export function HeaderMenu() { return null; }
