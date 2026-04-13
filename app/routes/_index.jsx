import {Await, useLoaderData, Link} from 'react-router';
import {Suspense, useState, useEffect} from 'react';
import {motion, useScroll, useTransform} from 'framer-motion';
import {useRef} from 'react';
import {ProductItem} from '~/components/ProductItem';
import {Hero} from '~/components/Hero';
import {ZodiacDiscovery} from '~/components/ZodiacDiscovery';

export const meta = () => {
  return [{title: 'LOOREA JEWELLERY | Handcrafted Estonia'}];
};

// [MOCK DATA LAYER]
const MOCK_COLLECTIONS = [
  { id: 'c1', title: 'PLANET', handle: 'planet', image: { url: '/images/loorea_hero_detail.png' } },
  { id: 'c2', title: 'ZODIAC', handle: 'zodiac', image: { url: '/images/loorea_hero_signature.png' } },
  { id: 'c3', title: 'ARCHIVE', handle: 'archive', image: { url: '/images/loorea_hero_kalendae.png' } }
];

const MOCK_PRODUCTS = [
  {
    id: 'p1', title: 'Celestial Zodiac Ring', handle: 'zodiac-ring',
    featuredImage: { url: '/images/zodiac_ring.png' },
    priceRange: { minVariantPrice: { amount: '450.00', currencyCode: 'EUR' } }
  },
  {
    id: 'p2', title: 'Planet Pendant', handle: 'planet-necklace',
    featuredImage: { url: '/images/planet_pendant.png' },
    priceRange: { minVariantPrice: { amount: '890.00', currencyCode: 'EUR' } }
  },
  {
    id: 'p3', title: 'Filigree Bangle', handle: 'filigree-bangle',
    featuredImage: { url: '/images/filigree_bangle.png' },
    priceRange: { minVariantPrice: { amount: '1200.00', currencyCode: 'EUR' } }
  },
  {
    id: 'p4', title: 'Liquid Drop Earrings', handle: 'drop-earrings',
    featuredImage: { url: '/images/drop_earrings.png' },
    priceRange: { minVariantPrice: { amount: '320.00', currencyCode: 'EUR' } }
  }
];

export async function loader(args) {
  const {storefront} = args.context;
  
  try {
    const fetchedCollections = await storefront.query(FEATURED_COLLECTIONS_QUERY)
      .catch(() => null);
    
    const fetchedProducts = await storefront.query(NEW_ARRIVALS_QUERY)
      .catch(() => null);

    const collectionNodes = fetchedCollections?.collections?.nodes || [];
    const productNodes = fetchedProducts?.products?.nodes || [];

    return {
      featuredCollections: collectionNodes.length > 0 ? collectionNodes : MOCK_COLLECTIONS,
      newArrivals: productNodes.length > 0 ? productNodes : MOCK_PRODUCTS,
    };
  } catch (error) {
    return {
      featuredCollections: MOCK_COLLECTIONS,
      newArrivals: MOCK_PRODUCTS,
    };
  }
}

export default function Homepage() {
  const data = useLoaderData();
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="bg-background">
      <Hero />

      {/* STICKY VERTICAL CARD STACKING */}
      <div className="relative">
        {data.featuredCollections.map((collection, idx) => (
          <EditorialCollectionSection 
            key={collection.id} 
            collection={collection} 
            idx={idx} 
            total={data.featuredCollections.length}
          />
        ))}
      </div>

      {/* ATMOSPHERIC BRAND REVELATION */}
      <section className="relative h-[80vh] bg-background flex items-center justify-center overflow-hidden border-b border-foreground/5 px-6">
        <div className="absolute left-0 top-0 bottom-0 w-24 hidden lg:flex items-center justify-center pointer-events-none">
          <span className="[writing-mode:vertical-lr] text-[8vw] font-serif font-black italic tracking-tighter opacity-[0.03] rotate-180 uppercase select-none">
            The Alchemy
          </span>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl text-center space-y-12"
        >
          <div className="flex flex-col items-center gap-4">
             <div className="w-[1px] h-20 bg-accent" />
             <span className="text-[10px] uppercase tracking-[0.6em] text-accent font-bold">Our Philosophy</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif italic tracking-tighter leading-snug">
            "Material Meditation: Transforming raw silver into wearable constellations."
          </h2>
          <p className="text-xs font-light text-foreground/40 leading-[2] tracking-widest max-w-sm mx-auto uppercase">
            A dialogue between ancestral filigree roots and the modern seeker.
          </p>
        </motion.div>

        <div className="absolute right-0 top-0 bottom-0 w-24 hidden lg:flex items-center justify-center pointer-events-none text-right">
          <span className="[writing-mode:vertical-lr] text-[8vw] font-serif font-black italic tracking-tighter opacity-[0.03] uppercase select-none">
            Established 1996
          </span>
        </div>
      </section>

      {/* UNIFORM NEW ARRIVALS GRID */}
      <section className="relative z-40 bg-background px-6 md:px-24 py-48 md:py-64 space-y-32">
        <div className="flex flex-col items-center gap-8 text-center max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold">The Craft</span>
          <h2 className="text-editorial-title">Artisan Series</h2>
          <p className="text-xs font-light text-foreground/40 leading-relaxed tracking-wider">
            Each LOOREA piece is a unique dialogue between traditional Estonian filigree craftsmanship and modern avant-garde jewellery design. 
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {data.newArrivals.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductItem product={product} />
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center pt-16">
          <Link to="/collections/all" className="btn-vermillion">
            View All Series
          </Link>
        </div>
      </section>

      {/* ZODIAC DISCOVERY SYSTEM */}
      <ZodiacDiscovery />

      {/* IMMERSIVE BRAND SIGNAGE */}
      <section className="h-[70vh] flex items-center justify-center bg-foreground overflow-hidden">
         <motion.h2 
           initial={{ scale: 1.5, opacity: 0 }}
           whileInView={{ scale: 1, opacity: 0.1 }}
           transition={{ duration: 3 }}
           className="text-[30vw] font-serif font-black italic tracking-tighter text-background whitespace-nowrap"
         >
           LOOREA JEWELLERY
         </motion.h2>
      </section>
    </div>
  );
}

function EditorialCollectionSection({collection, idx, total}) {
  const sectionRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const {scrollYProgress} = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);

  return (
    <motion.section 
      ref={sectionRef} 
      style={{ 
        scale: isMounted ? scale : 1, 
        opacity: isMounted ? opacity : 1,
        zIndex: idx + 1 
      }}
      className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-background border-b border-foreground/5 shadow-2xl origin-bottom"
    >
      <div className="absolute inset-0 z-0">
        <img 
          src={collection.image?.url || `/images/collection_${idx + 1}.png`} 
          alt={collection.title}
          className="w-full h-full object-cover grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-black/15 transition-colors" />
      </div>

      <div className="relative z-10 text-center space-y-12 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-white text-8xl md:text-[14rem] font-serif italic tracking-tighter select-none drop-shadow-2xl">
            {collection.title}
          </h2>
          <span className="inline-block px-12 py-3 glass-light border border-white/30 text-white text-[10px] uppercase tracking-[0.8em] font-medium backdrop-blur-3xl">
            Category Card — 0{idx + 1}
          </span>
        </motion.div>
        
        <div className="pt-24">
          <Link to={`/collections/${collection.handle}`} className="group flex flex-col items-center gap-6">
             <div className="w-[1px] h-24 bg-white/40 group-hover:h-32 group-hover:bg-accent transition-all duration-1000" />
             <span className="text-white text-[10px] uppercase tracking-[1em] font-medium opacity-60 group-hover:opacity-100 transition-opacity">
               Explore Collection
             </span>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

const FEATURED_COLLECTIONS_QUERY = `#graphql
  query FeaturedCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 3, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        image { url altText width height }
      }
    }
  }
`;

const NEW_ARRIVALS_QUERY = `#graphql
  query NewArrivals ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        priceRange { minVariantPrice { amount currencyCode } }
        featuredImage { url altText width height }
      }
    }
  }
`;
