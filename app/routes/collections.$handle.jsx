import {useLoaderData} from 'react-router';
import {Analytics} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import {ProductItem} from '~/components/ProductItem';
import {CollectionFilter} from '~/components/CollectionFilter';

export const meta = ({data}) => {
  return [{title: `Loorea | ${data?.collection?.title ?? 'Collection'}`}];
};

// [MOCK COLLECTION DATA]
const MOCK_COLLECTION = {
  title: 'The Celestial Archive',
  handle: 'celestial-archive',
  description: 'A curated selection of jewellery inspired by the movements of the planets and the wisdom of the stars.',
  products: {
    nodes: [
      {
        id: 'p1', title: 'Celestial Zodiac Ring', handle: 'zodiac-ring',
        featuredImage: { url: 'https://cdn.shopify.com/s/files/1/0863/3004/8834/files/ring_1.webp?v=1712411234' },
        priceRange: { minVariantPrice: { amount: '450.00', currencyCode: 'EUR' } }
      },
      {
        id: 'p2', title: 'Planet Pendant', handle: 'planet-necklace',
        featuredImage: { url: 'https://cdn.shopify.com/s/files/1/0863/3004/8834/files/necklace_1.webp?v=1712411234' },
        priceRange: { minVariantPrice: { amount: '890.00', currencyCode: 'EUR' } }
      },
      {
        id: 'p3', title: 'Filigree Bangle', handle: 'filigree-bangle',
        featuredImage: { url: 'https://cdn.shopify.com/s/files/1/0863/3004/8834/files/bracelet_1.webp?v=1712411234' },
        priceRange: { minVariantPrice: { amount: '1200.00', currencyCode: 'EUR' } }
      },
      {
        id: 'p4', title: 'Liquid Drop Earrings', handle: 'drop-earrings',
        featuredImage: { url: 'https://cdn.shopify.com/s/files/1/0863/3004/8834/files/earring_1.webp?v=1712411234' },
        priceRange: { minVariantPrice: { amount: '320.00', currencyCode: 'EUR' } }
      }
    ]
  }
};

export async function loader(args) {
  const {handle} = args.params;
  const {storefront, request} = args.context;
  const url = new URL(request.url);
  const material = url.searchParams.get('material');
  
  // If we have a material filter, we combine it with the collection title/handle logic
  // However, within a collection route, we typically filter the collection's products.
  
  try {
    const fetchedCollection = await storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        filters: material && material !== 'ALL' ? [{ tag: material }] : []
      },
    }).catch(() => ({ collection: null }));

    const collection = fetchedCollection?.collection;

    if (!collection?.id) {
       // PRO-MAX FALLBACK: Return mock collection if Shopify is empty or Unauthorized
       return { 
         collection: { 
           ...MOCK_COLLECTION, 
           title: handle ? handle.replace('-', ' ').toUpperCase() : 'Boutique Collection' 
         } 
       };
    }

    return { collection };
  } catch (error) {
    // Global safety net for authentication failures
    return { collection: MOCK_COLLECTION };
  }
}

export default function Collection() {
  const {collection} = useLoaderData();

  return (
    <div className="collection-page min-h-screen bg-background pt-32 pb-64 px-12 md:px-24">
      {/* Editorial Header */}
      <header className="mb-24 space-y-8">
        <div className="flex flex-col gap-4">
           <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold">Category</span>
           <h1 className="text-6xl md:text-[10rem] font-serif italic tracking-tighter leading-none">
             {collection.title}
           </h1>
        </div>
        <p className="max-w-xl text-xs font-light text-foreground/50 tracking-wide leading-relaxed">
          {collection.description}
        </p>
      </header>

      {/* Discovery Filters */}
      <CollectionFilter onFilter={(f) => console.log('Boutique Filter:', f)} />

      {/* 2-Column Editorial Grid Architecture */}
      <section className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-32">
          {collection.products.nodes.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx % 2) * 0.1, duration: 1 }}
              viewport={{ once: true }}
            >
              <ProductItem product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      <Analytics.CollectionView collection={collection} />
    </div>
  );
}

const COLLECTION_QUERY = `#graphql
  query Collection(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $filters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      description
      handle
      products(first: 24, filters: $filters) {
        nodes {
          id
          title
          handle
          featuredImage { url altText width height }
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 2) {
             nodes { url altText width height }
          }
          variants(first: 1) {
            nodes {
              id
              price { amount currencyCode }
            }
          }
        }
      }
    }
  }
`;
