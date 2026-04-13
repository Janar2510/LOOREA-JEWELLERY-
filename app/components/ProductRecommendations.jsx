import {useFetcher} from 'react-router';
import {useEffect, useRef} from 'react';
import {motion} from 'framer-motion';
import {ProductItem} from './ProductItem';

/**
 * @param {{
 *   productId: string;
 *   title?: string;
 * }}
 */
export function ProductRecommendations({productId, title = "You May Also Desire"}) {
  const fetcher = useFetcher();
  const products = fetcher.data?.productRecommendations || [];
  const hasFetched = useRef(false);

  useEffect(() => {
    if (productId && !hasFetched.current) {
      fetcher.load(`/api/recommendations?productId=${productId}`);
      hasFetched.current = true;
    }
  }, [productId, fetcher]);

  if (!products.length && fetcher.state === 'idle' && hasFetched.current) {
     return null; // Don't render if no recommendations
  }

  return (
    <section className="mt-64 border-t border-foreground/5 pt-32 px-6 md:px-24">
      <div className="flex flex-col items-center gap-6 text-center mb-24">
        <span className="text-[9px] uppercase tracking-[0.6em] text-accent/50 font-bold">{title}</span>
        <h2 className="text-4xl md:text-7xl font-serif italic tracking-tighter leading-none">Complementary Pieces</h2>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {products.length > 0 ? (
          products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductItem product={product} />
            </motion.div>
          ))
        ) : (
          // Skeleton loaders or placeholders if fetching
          [...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4 animate-pulse">
               <div className="aspect-[3/4] bg-muted rounded-xs" />
               <div className="h-2 w-2/3 bg-muted mx-auto" />
               <div className="h-2 w-1/3 bg-muted mx-auto" />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
