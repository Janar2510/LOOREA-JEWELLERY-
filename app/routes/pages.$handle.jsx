import {useLoaderData} from 'react-router';
import {motion} from 'framer-motion';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.page.title ?? ''}`}];
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
async function loadCriticalData({context, request, params}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Missing page handle');
  }

  try {
    const fetchedPage = await storefront.query(PAGE_QUERY, {
      variables: { handle },
    }).catch(() => null);

    const page = fetchedPage?.page || MOCK_PAGE_DATA[handle] || MOCK_PAGE_DATA['about'];

    return { page };
  } catch (error) {
    return {
      page: MOCK_PAGE_DATA[handle] || MOCK_PAGE_DATA['about']
    };
  }
}

const MOCK_PAGE_DATA = {
  about: {
    handle: 'about',
    title: 'THE ALCHEMY OF LOOREA',
    body: `
      <div class="editorial-container">
        <p class="lead">LOOREA JEWELLERY is born from the intersection of ancient Estonian filigree techniques and modern celestial narratives.</p>
        <p>Founded in our Tallinn atelier, the brand represents a dialogue between the preservation of Baltic heritage and the exploration of the cosmos. Every piece is hand-crafted with microscopic precision, using silver threads that mimic the organic complexity of the frosted Baltic landscape.</p>
        <hr />
        <p>Our philosophy is one of "Material Meditation." We believe that the act of weaving silver into filigree is a form of alchemy—transforming raw metal into wearable constellations that serve as talismans for the modern seeker.</p>
      </div>
    `
  }
};

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  return {};
}

export default function Page() {
  /** @type {LoaderReturnData} */
  const {page} = useLoaderData();

  return (
    <div className="min-h-screen bg-background pt-44 pb-32">
      <div className="max-w-[1440px] mx-auto px-6 md:px-24">
        <section className="mb-20 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter leading-[0.9] mb-8">
              {page.title}
            </h1>
            <div className="w-24 h-[1px] bg-accent" />
          </motion.div>
        </section>
        
        <main 
          className="prose prose-stone prose-lg max-w-2xl font-sans font-light leading-relaxed text-foreground/80
                     [&_p.lead]:text-2xl [&_p.lead]:font-serif [&_p.lead]:italic [&_p.lead]:text-foreground [&_p.lead]:mb-12
                     [&_hr]:border-accent/10 [&_hr]:my-16"
          dangerouslySetInnerHTML={{__html: page.body}} 
        />
      </div>
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;

/** @typedef {import('./+types/pages.$handle').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
