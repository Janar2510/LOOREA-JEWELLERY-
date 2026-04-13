import {useLoaderData} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {SearchForm} from '~/components/SearchForm';
import {SearchResults} from '~/components/SearchResults';
import {getEmptyPredictiveSearchResult} from '~/lib/search';
import {ProductItem} from '~/components/ProductItem';
import {motion} from 'framer-motion';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: `LOOREA | Search Products`}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({request, context}) {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');
  const searchPromise = isPredictive
    ? predictiveSearch({request, context})
    : regularSearch({request, context});

  searchPromise.catch((error) => {
    console.error(error);
    return {term: '', result: null, error: error.message};
  });

  return await searchPromise;
}

/**
 * Renders the /search route with the Boutique editorial grid
 */
export default function SearchPage() {
  /** @type {LoaderReturnData} */
  const {type, term, result, error} = useLoaderData();
  if (type === 'predictive') return null;

  return (
    <div className="search-page min-h-screen pt-32 px-12 md:px-24 pb-64">
      {/* Editorial Search Header */}
      <header className="mb-24 space-y-8">
        <div className="flex flex-col gap-4">
           <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold italic">Discovery</span>
           <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter leading-none">
             Search <span className="opacity-20">Results</span>
           </h1>
        </div>
      </header>

      <section className="mb-24">
        <SearchForm>
          {({inputRef}) => (
            <div className="relative border-b border-foreground/10 pb-4 max-w-2xl flex items-center justify-between">
              <input
                defaultValue={term}
                name="q"
                placeholder="Search the archive..."
                ref={inputRef}
                type="search"
                className="bg-transparent border-none text-2xl font-light focus:ring-0 placeholder:text-foreground/20 w-full"
              />
              <button type="submit" className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent hover:text-foreground transition-colors">
                Explore
              </button>
            </div>
          )}
        </SearchForm>
      </section>

      {error && <p className="text-red-500 font-mono text-xs mb-8">{error}</p>}

      {!term || !result?.total ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-4 opacity-30">
           <span className="text-[10px] uppercase tracking-[0.5em]">No findings for "{term}"</span>
           <div className="w-20 h-[1px] bg-foreground/20" />
        </div>
      ) : (
        <SearchResults result={result} term={term}>
          {({products, term}) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-32">
              {products.nodes.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx % 2) * 0.1, duration: 1 }}
                  viewport={{ once: true }}
                >
                  <ProductItem product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </SearchResults>
      )}
      <Analytics.SearchView data={{searchTerm: term, searchResults: result}} />
    </div>
  );
}

/**
 * Regular search query and fragments
 * (adjust as needed)
 */
const SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
    featuredImage {
       url
       altText
       width
       height
    }
    images(first: 2) {
       nodes {
          url
          altText
          width
          height
       }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;

const SEARCH_PAGE_FRAGMENT = `#graphql
  fragment SearchPage on Page {
     __typename
     handle
    id
    title
    trackingParameters
  }
`;

const SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
  }
`;

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/search
export const SEARCH_QUERY = `#graphql
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    articles: search(
      query: $term,
      types: [ARTICLE],
      first: $first,
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
    pages: search(
      query: $term,
      types: [PAGE],
      first: $first,
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    products: search(
      after: $endCursor,
      before: $startCursor,
      first: $first,
      last: $last,
      query: $term,
      sortKey: RELEVANCE,
      types: [PRODUCT],
      unavailableProducts: HIDE,
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
  ${SEARCH_PAGE_FRAGMENT}
  ${SEARCH_ARTICLE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

/**
 * Regular search fetcher
 * @param {Pick<
 *   Route.LoaderArgs,
 *   'request' | 'context'
 * >}
 * @return {Promise<RegularSearchReturn>}
 */
async function regularSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const variables = getPaginationVariables(request, {pageBy: 12});
  const term = String(url.searchParams.get('q') || '');

  // Search articles, pages, and products for the `q` term
  const fetchedItems = await storefront.query(SEARCH_QUERY, {
    variables: {...variables, term},
  }).catch(() => null);

  if (!fetchedItems) {
    return {
      type: 'regular', 
      term, 
      result: {
        total: 0, 
        items: {
          products: {nodes: []},
          articles: {nodes: []},
          pages: {nodes: []}
        }
      }
    };
  }

  const {errors, ...items} = fetchedItems;

  const total = Object.values(items).reduce(
    (acc, {nodes}) => acc + nodes.length,
    0,
  );

  const error = errors
    ? errors.map(({message}) => message).join(', ')
    : undefined;

  return {type: 'regular', term, error, result: {total, items}};
}

/**
 * Predictive search query and fragments
 * (adjust as needed)
 */
const PREDICTIVE_SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment PredictiveArticle on Article {
    __typename
    id
    title
    handle
    blog {
      handle
    }
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
`;

const PREDICTIVE_SEARCH_COLLECTION_FRAGMENT = `#graphql
  fragment PredictiveCollection on Collection {
    __typename
    id
    title
    handle
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
`;

const PREDICTIVE_SEARCH_PAGE_FRAGMENT = `#graphql
  fragment PredictivePage on Page {
    __typename
    id
    title
    handle
    trackingParameters
  }
`;

const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment PredictiveProduct on Product {
    __typename
    id
    title
    handle
    trackingParameters
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
    }
  }
`;

const PREDICTIVE_SEARCH_QUERY_FRAGMENT = `#graphql
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename
    text
    styledText
    trackingParameters
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/predictiveSearch
const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit,
      limitScope: $limitScope,
      query: $term,
      types: $types,
    ) {
      articles {
        ...PredictiveArticle
      }
      collections {
        ...PredictiveCollection
      }
      pages {
        ...PredictivePage
      }
      products {
        ...PredictiveProduct
      }
      queries {
        ...PredictiveQuery
      }
    }
  }
  ${PREDICTIVE_SEARCH_ARTICLE_FRAGMENT}
  ${PREDICTIVE_SEARCH_COLLECTION_FRAGMENT}
  ${PREDICTIVE_SEARCH_PAGE_FRAGMENT}
  ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
  ${PREDICTIVE_SEARCH_QUERY_FRAGMENT}
`;

/**
 * Predictive search fetcher
 * @param {Pick<
 *   Route.ActionArgs,
 *   'request' | 'context'
 * >}
 * @return {Promise<PredictiveSearchReturn>}
 */
async function predictiveSearch({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);
  const type = 'predictive';

  if (!term) return {type, term, result: getEmptyPredictiveSearchResult()};

  // Predictively search articles, collections, pages, products, and queries (suggestions)
  const fetchedPredictive = await storefront.query(
    PREDICTIVE_SEARCH_QUERY,
    {
      variables: {
        // customize search options as needed
        limit,
        limitScope: 'EACH',
        term,
      },
    },
  ).catch(() => null);

  if (!fetchedPredictive) {
    return {type, term, result: getEmptyPredictiveSearchResult()};
  }

  const {predictiveSearch: items, errors} = fetchedPredictive;

  const total = Object.values(items).reduce(
    (acc, item) => acc + item.length,
    0,
  );

  return {type, term, result: {items, total}};
}

/** @typedef {import('./+types/search').Route} Route */
/** @typedef {import('~/lib/search').RegularSearchReturn} RegularSearchReturn */
/** @typedef {import('~/lib/search').PredictiveSearchReturn} PredictiveSearchReturn */
/** @typedef {import('storefrontapi.generated').RegularSearchQuery} RegularSearchQuery */
/** @typedef {import('storefrontapi.generated').PredictiveSearchQuery} PredictiveSearchQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
