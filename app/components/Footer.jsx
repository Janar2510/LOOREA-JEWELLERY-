import {NavLink} from 'react-router';

/**
 * @param {FooterProps}
 */
export function Footer({menu, shop}) {
  return (
    <footer className="bg-background pt-48 pb-12 px-6 md:px-24 border-t border-foreground/5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-24 items-start">
        
        {/* Column 1: Brand & Vertical Identity */}
        <div className="md:col-span-1 space-y-8">
          <div className="flex flex-col gap-1 items-start">
            <span className="text-3xl font-serif italic tracking-tighter">Loorea</span>
            <span className="text-[9px] uppercase tracking-[0.4em] opacity-30">Tallinn atelier</span>
          </div>
          <p className="text-[11px] font-light leading-loose text-foreground/40 max-w-[200px]">
            Contemporary filigree jewellery handcrafted with devotion in Estonia. A dialogue between heritage and avant-garde.
          </p>
        </div>

        {/* Column 2: Navigation */}
        <div className="md:col-span-1 space-y-8">
          <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold">Archives</h4>
          <nav className="flex flex-col gap-4 text-[11px] font-medium tracking-wider text-foreground/50">
            {(menu || FALLBACK_FOOTER_MENU).items.map((item) => (
              <NavLink key={item.id} to={item.url} className="hover:text-foreground transition-colors">
                {item.title}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Column 3: Contact */}
        <div className="md:col-span-1 space-y-8">
          <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold">Connect</h4>
          <div className="flex flex-col gap-4 text-[11px] font-medium tracking-wider text-foreground/50">
            <a href="https://instagram.com/loorea" className="hover:text-foreground transition-colors">Instagram</a>
            <a href="https://facebook.com/loorea" className="hover:text-foreground transition-colors">Facebook</a>
            <a href="mailto:hello@loorea.com" className="hover:text-foreground transition-colors">hello@loorea.com</a>
          </div>
        </div>

        {/* Column 4: Newsletter */}
        <div className="md:col-span-1 space-y-8">
          <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold">Journal</h4>
          <div className="space-y-4">
            <p className="text-[11px] font-light text-foreground/40">Subscribe for seasonal archival releases and invitations.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="email address" 
                className="w-full bg-transparent border-b border-foreground/10 pb-4 text-xs font-light focus:outline-none focus:border-foreground transition-colors"
              />
              <button className="absolute right-0 bottom-4 text-[9px] uppercase tracking-[0.2em] opacity-30 group-hover:opacity-100 transition-opacity">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-48 pt-12 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex gap-12 text-[9px] uppercase tracking-[0.2em] font-medium opacity-20">
          <NavLink to="/policies/privacy-policy">Privacy</NavLink>
          <NavLink to="/policies/refund-policy">Returns</NavLink>
          <NavLink to="/policies/terms-of-service">Terms</NavLink>
        </div>
        <span className="text-[9px] uppercase tracking-[0.4em] font-medium opacity-20">
          © {new Date().getFullYear()} LOOREA JEWELLERY — Tallinn. Crafted with devotion.
        </span>
      </div>
    </footer>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {id: '1', title: 'Shop Items', url: '/collections/all'},
    {id: '2', title: 'Season Gallery', url: '/gallery'},
    {id: '3', title: 'The Journal', url: '/journal'},
    {id: '4', title: 'Brand News', url: '/news'},
    {id: '5', title: 'Press Archive', url: '/press'},
  ],
};

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {{menu: FooterQuery['menu']; shop: HeaderQuery['shop']}} FooterProps */
