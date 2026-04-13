import {Suspense, useState, useEffect} from 'react';
import {Await, useLoaderData, Link} from 'react-router';
import {Analytics, Image, Money, VariantSelector, CartForm} from '@shopify/hydrogen';
import {motion, AnimatePresence} from 'framer-motion';
import {clsx} from 'clsx';
import {ArrowRight} from 'lucide-react';
import {ProductItem} from '~/components/ProductItem';
import {ProductRecommendations} from '~/components/ProductRecommendations';
import {useAside} from '~/components/Aside';

export const meta = ({data}) => {
  return [{title: `Loorea | ${data?.product?.title ?? 'Jewellery'}`}];
};

// [MOCK PRODUCT DATA FOR PDP]
const MOCK_PRODUCT = {
  id: 'p1',
  title: 'Celestial Zodiac Ring',
  handle: 'zodiac-ring',
  descriptionHtml: '<p>A masterpiece of Estonain filigree. This Celestial Zodiac ring is handcrafted in 925 sterling silver, featuring a central moonstone that captures the essence of the northern night sky.</p><p>Part of our limited "Artisan Series", each piece is numbered and signed by the master craftsman.</p>',
  images: {
    nodes: [
      { id: 'i1', url: '/images/zodiac_ring.png', altText: 'Zodiac Ring Main' },
      { id: 'i2', url: '/images/loorea_hero_signature.png', altText: 'Zodiac Ring Detail 1' },
      { id: 'i3', url: '/images/loorea_hero_rings.png', altText: 'Zodiac Ring Detail 2' }
    ]
  },
  variants: {
    nodes: [
      { id: 'v1', title: 'Sterling Silver', price: { amount: '450.00', currencyCode: 'EUR' }, availableForSale: true },
      { id: 'v2', title: '18K Gold Vermeil', price: { amount: '680.00', currencyCode: 'EUR' }, availableForSale: true }
    ]
  }
};

const MOCK_PRODUCTS = [
  {
    id: 'p1', title: 'Celestial Zodiac Ring', handle: 'zodiac-ring',
    featuredImage: { url: '/images/zodiac_ring.png' },
    images: { nodes: [{ url: '/images/zodiac_ring.png' }, { url: '/images/loorea_hero_signature.png' }] },
    priceRange: { minVariantPrice: { amount: '450.00', currencyCode: 'EUR' } },
    variants: { nodes: [{ price: { amount: '450.00', currencyCode: 'EUR' } }] }
  },
  {
    id: 'p2', title: 'Planet Pendant', handle: 'planet-necklace',
    featuredImage: { url: '/images/planet_pendant.png' },
    images: { nodes: [{ url: '/images/planet_pendant.png' }, { url: '/images/loorea_hero_detail.png' }] },
    priceRange: { minVariantPrice: { amount: '890.00', currencyCode: 'EUR' } },
    variants: { nodes: [{ price: { amount: '890.00', currencyCode: 'EUR' } }] }
  },
  {
    id: 'p3', title: 'Filigree Bangle', handle: 'filigree-bangle',
    featuredImage: { url: '/images/filigree_bangle.png' },
    images: { nodes: [{ url: '/images/filigree_bangle.png' }, { url: '/images/loorea_hero_rings.png' }] },
    priceRange: { minVariantPrice: { amount: '1200.00', currencyCode: 'EUR' } },
    variants: { nodes: [{ price: { amount: '1200.00', currencyCode: 'EUR' } }] }
  },
  {
    id: 'p4', title: 'Liquid Drop Earrings', handle: 'drop-earrings',
    featuredImage: { url: '/images/drop_earrings.png' },
    images: { nodes: [{ url: '/images/drop_earrings.png' }, { url: '/images/loorea_hero_kalendae.png' }] },
    priceRange: { minVariantPrice: { amount: '320.00', currencyCode: 'EUR' } },
    variants: { nodes: [{ price: { amount: '320.00', currencyCode: 'EUR' } }] }
  }
];

export async function loader(args) {
  const {handle} = args.params;
  const {storefront} = args.context;
  
  try {
    const fetchedProduct = await storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: []},
    }).catch(() => ({ product: null }));

    const product = fetchedProduct?.product;

    if (!product?.id) {
       // PRO-MAX FALLBACK: Return mock product if Shopify is empty or Unauthorized
       return { product: MOCK_PRODUCT, selectedVariant: MOCK_PRODUCT.variants.nodes[0] };
    }

    return { product, selectedVariant: product.variants.nodes[0] };
  } catch (error) {
    // Global safety net for authentication failures
    return { product: MOCK_PRODUCT, selectedVariant: MOCK_PRODUCT.variants.nodes[0] };
  }
}

export default function Product() {
  const {product, selectedVariant} = useLoaderData();
  const {title, descriptionHtml, images} = product;
  const {open} = useAside();
  
  // Reactive state for variant selection
  const [currentVariant, setCurrentVariant] = useState(selectedVariant);

  const handleAddToCart = () => {
    open('cart');
  };

  return (
    <div className="product-page min-h-screen bg-background pt-24 md:pt-32 pb-32">
      <div className="flex flex-col lg:flex-row max-w-[1440px] mx-auto px-6 md:px-24 gap-12 lg:gap-32">
        
        {/* Left Column: Vertically Scrolling Image Lookbook (60% width) */}
        <div className="w-full lg:w-[55%] flex flex-col gap-8 md:gap-16">
          {images?.nodes?.map((image, idx) => (
            <motion.div
              key={image?.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className={clsx(
                "relative overflow-hidden group bg-muted/40 rounded-xs",
                idx % 3 === 0 ? "aspect-[3/4]" : "aspect-[1/1] w-4/5 mx-auto"
              )}
            >
              {image?.url && (
                <img
                  src={image.url}
                  alt={image.altText || title}
                  className="w-full h-full object-cover transition-transform duration-[5s] hover:scale-[1.02] ease-out"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Right Column: Sticky Product Architecture (45% width) */}
        <div className="w-full lg:w-[45%] h-fit lg:sticky lg:top-44 space-y-20 pb-24">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12"
          >
            {/* Header: Identity */}
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="h-[1px] w-12 bg-accent" />
                  <span className="text-[10px] uppercase tracking-[0.6em] text-accent font-bold">The Archive</span>
               </div>
               <h1 className="text-6xl md:text-9xl font-serif italic tracking-tighter leading-[0.75]">{title}</h1>
               <div className="pt-4 flex items-baseline gap-4">
                  <span className="text-2xl md:text-3xl font-serif"><Money data={selectedVariant.price} /></span>
                  <span className="text-[9px] uppercase tracking-[0.3em] opacity-30 font-medium">VAT Included</span>
               </div>
            </div>

            {/* Description Editorial */}
            <div className="max-w-md space-y-12">
               <div 
                 className="prose prose-sm font-sans font-light leading-loose text-foreground/60 tracking-wide text-xs"
                 dangerouslySetInnerHTML={{__html: descriptionHtml}}
               />
               
               {/* THE ALCHEMY: Technical Specs */}
               <div className="pt-8 border-t border-foreground/5 space-y-8">
                  <h4 className="text-[10px] uppercase tracking-[0.5em] font-bold text-foreground/40 italic">The Alchemy</h4>
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <span className="block text-[9px] uppercase tracking-[0.2em] opacity-30">Material</span>
                        <span className="block text-[10px] uppercase tracking-[0.2em] font-medium">925 Sterling Silver</span>
                     </div>
                     <div className="space-y-2">
                        <span className="block text-[9px] uppercase tracking-[0.2em] opacity-30">Technique</span>
                        <span className="block text-[10px] uppercase tracking-[0.2em] font-medium">Estonian Filigree</span>
                     </div>
                  </div>
               </div>

               {/* Variant Selector UI */}
               <div className="space-y-6">
                  <div className="flex gap-4">
                     {product.variants?.nodes?.map((v) => (
                        <button 
                          key={v.id}
                          onClick={() => setCurrentVariant(v)}
                          className={`flex-1 py-4 text-[9px] uppercase tracking-[0.3em] font-bold border transition-all duration-700
                                     ${v.id === currentVariant?.id ? 'border-accent text-accent bg-accent/5' : 'border-foreground/10 hover:border-foreground/30'}`}
                        >
                          {v.title}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
          </motion.div>

          {/* Checkout Action */}
          <div className="pt-12 space-y-8">
             <CartForm
               route="/cart"
               action={CartForm.ACTIONS.LinesAdd}
               inputs={{
                 lines: [
                   {
                     merchandiseId: currentVariant.id,
                     quantity: 1,
                   },
                 ],
               }}
             >
               {(fetcher) => (
                 <button 
                   type="submit"
                   onClick={handleAddToCart}
                   disabled={fetcher.state !== 'idle' || !selectedVariant.availableForSale}
                   className="w-full btn-vermillion py-8 group relative overflow-hidden disabled:opacity-50"
                 >
                    <div className="relative z-10 flex items-center justify-center gap-4">
                       <span>{currentVariant.availableForSale ? 'Archive This Piece' : 'Sold Out'}</span>
                       <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-700" />
                    </div>
                 </button>
               )}
             </CartForm>
             
             <div className="flex justify-between text-[8px] uppercase tracking-[0.4em] opacity-30 font-medium px-2">
                <span>Handcrafted In Estonia</span>
                <div className="w-2 h-[1px] bg-foreground/20 mt-1" />
                <span>Certificate Of Origin</span>
             </div>
          </div>
        </div>
      </div>

      {/* RELATED SERIES GRID (DYNAMIC RECOMMENDATIONS) */}
      <ProductRecommendations productId={product.id} />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice { amount currencyCode }
    id
    image { __typename id url altText width height }
    price { amount currencyCode }
    product { title handle }
    selectedOptions { name value }
    sku
    title
    unitPrice { amount currencyCode }
  }
`;

const PRODUCT_QUERY = `#graphql
  query Product($country: CountryCode, $handle: String!, $language: LanguageCode, $selectedOptions: [SelectedOptionInput!]!)
    @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      handle
      descriptionHtml
      description
      images(first: 10) {
        nodes { id url altText width height }
      }
      options { name values }
      variants(first: 10) {
        nodes { ...ProductVariant }
      }
      seo { description title }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;
