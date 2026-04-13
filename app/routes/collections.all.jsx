import {useLoaderData} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import {CollectionFilter} from '~/components/CollectionFilter';
import {motion} from 'framer-motion';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: `LOOREA | Boutique`}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, request}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  const category = searchParams.get('category');
  const material = searchParams.get('material');
  
  let queryParts = [];
  if (category && category !== 'ALL') queryParts.push(`tag:${category}`);
  if (material && material !== 'ALL') queryParts.push(`tag:${material}`);
  
  const query = queryParts.length > 0 ? queryParts.join(' AND ') : '';

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  try {
    const fetchedProducts = await storefront.query(CATALOG_QUERY, {
      variables: {
        ...paginationVariables,
        query
      },
    }).catch((error) => {
      console.error('Boutique Query Error:', error);
      return { products: { nodes: [] } };
    });

    const products = fetchedProducts?.products?.nodes?.length > 0 
      ? fetchedProducts.products 
      : { 
          nodes: MOCK_PRODUCTS_CATALOG, 
          pageInfo: { 
            hasPreviousPage: false, 
            hasNextPage: false,
            startCursor: null,
            endCursor: null
          } 
        };

    return {products};
  } catch (error) {
    return { 
      products: { 
        nodes: MOCK_PRODUCTS_CATALOG, 
        pageInfo: { 
          hasPreviousPage: false, 
          hasNextPage: false,
          startCursor: null,
          endCursor: null
        } 
      } 
    };
  }
}

const MOCK_PRODUCTS_CATALOG = [
  {
    id: 'p1', title: 'Celestial Zodiac Ring', handle: 'zodiac-ring',
    featuredImage: { url: 'https://cdn.shopify.com/s/files/1/0863/3004/8834/files/ring_1.webp?v=1712411234', width: 800, height: 1000 },
    images: { nodes: [{ url: 'https://cdn.shopify.com/s/files/1/0863/3004/8834/files/ring_1_hover.webp?v=1712411235' }] },
    priceRange: { minVariantPrice: { amount: '450.00', currencyCode: 'EUR' } }
  },
  {
    id: 'p2', title: 'Planet Pendant', handle: 'planet-necklace',
    featuredImage: { url: 'https://cdn.shopify.com/s/files/1/0863/3004/8834/files/necklace_1.webp?v=1712411234', width: 800, height: 1000 },
    images: { nodes: [{ url: 'https://cdn.shopify.com/s/files/1/0863/3004/8834/files/necklace_1_hover.webp?v=1712411235' }] },
    priceRange: { minVariantPrice: { amount: '890.00', currencyCode: 'EUR' } }
  },
  {
    id: 'p3', title: 'Filigree Bangle', handle: 'filigree-bangle',
    featuredImage: { url: 'https://cdn.shopify.com/s/files/1/0863/3004/8834/files/bracelet_1.webp?v=1712411234', width: 800, height: 1000 },
    images: { nodes: [{ url: 'https://cdn.shopify.com/s/files/1/0863/3004/8834/files/bracelet_1_hover.webp?v=1712411235' }] },
    priceRange: { minVariantPrice: { amount: '1200.00', currencyCode: 'EUR' } }
  },
  {
    id: 'p4', title: 'Liquid Drop Earrings', handle: 'drop-earrings',
    featuredImage: { url: 'https://cdn.shopify.com/s/files/1/0863/3004/8834/files/earring_1.webp?v=1712411234', width: 800, height: 1000 },
    images: { nodes: [{ url: 'https://cdn.shopify.com/s/files/1/0863/3004/8834/files/earring_1_hover.webp?v=1712411235' }] },
    priceRange: { minVariantPrice: { amount: '320.00', currencyCode: 'EUR' } }
  }
];

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  return {};
}

export default function Boutique() {
  /** @type {LoaderReturnData} */
  const {products} = useLoaderData();

  return (
    <div className="boutique-page pt-32 px-12 md:px-24">
      {/* Cinematic Editorial Header */}
      <header className="mb-32 space-y-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="text-[10px] uppercase tracking-[0.6em] text-accent font-bold">The Collective</span>
          <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter mt-4 leading-none">
            Boutique <span className="opacity-20">Store</span>
          </h1>
        </motion.div>
        <p className="text-[13px] tracking-wide leading-relaxed text-foreground/60 max-w-xl">
          Discover our curated collection of celestial-inspired jewellery. Each piece is a masterpiece of light and form, crafted to capture the essence of the stars.
        </p>
      </header>

      {/* Boutique Discovery Tools */}
      <CollectionFilter onFilter={(f) => console.log('Filter applied:', f)} />

      {/* 2-Column Editorial Grid */}
      <PaginatedResourceSection
        connection={products}
        resourcesClassName="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-32"
      >
        {({node: product, index}) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: (index % 2) * 0.1 }}
          >
            <ProductItem
              product={product}
              loading={index < 4 ? 'eager' : undefined}
            />
          </motion.div>
        )}
      </PaginatedResourceSection>
      
      <div className="h-40" />
    </div>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $query: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor, query: $query) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
`;

/** @typedef {import('./+types/collections.all').Route} Route */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
