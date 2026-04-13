import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import {clsx} from 'clsx';

/**
 * @param {{
 *   product: import('storefrontapi.generated').ProductItemFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductItem({product, loading}) {
  const variant = product.variants?.nodes[0] || {};
  const {price} = variant;

  return (
    <Link
      className="group block space-y-6"
      key={product.id}
      to={`/products/${product.handle}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-xs">
        {/* PRIMARY PRODUCT IMAGE (FLATLAY) */}
        {product.featuredImage && (
          <Image
            alt={product.featuredImage.altText || product.title}
            aspectRatio="3/4"
            data={product.featuredImage}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className={clsx(
              "absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
              product.images?.nodes[1] && "group-hover:opacity-0"
            )}
          />
        )}

        {/* SECONDARY LIFESTYLE IMAGE (HOVER) */}
        {product.images?.nodes[1] && (
          <Image
            alt={`Lifestyle shot of ${product.title}`}
            aspectRatio="3/4"
            data={product.images.nodes[1]}
            loading="lazy"
            sizes="(min-width: 45em) 400px, 100vw"
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 scale-[1.02] group-hover:scale-100 transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
          />
        )}
        
        {/* Soft Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700 pointer-events-none" />
      </div>

      {/* Precise Precise Typography Labeling */}
      <div className="flex flex-col items-center text-center space-y-1">
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-medium text-foreground/80 group-hover:text-accent transition-colors duration-500">
          {product.title}
        </h3>
        {price && (
          <div className="text-[10px] tracking-[0.2em] opacity-40 font-light">
            <Money data={price} />
          </div>
        )}
      </div>
    </Link>
  );
}
