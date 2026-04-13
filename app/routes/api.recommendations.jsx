/**
 * @param {import('@shopify/remix-oxygen').LoaderFunctionArgs} args
 */
export async function loader({request, context}) {
  const {storefront} = context;
  const url = new URL(request.url);
  const productId = url.searchParams.get('productId');

  // Defensive check: If no productId, return empty
  if (!productId) {
    return new Response(JSON.stringify({productRecommendations: []}), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await storefront.query(RECOMMENDATIONS_QUERY, {
      variables: {productId, count: 4},
    });

    // Handle case where query succeeds but returned data is empty/null
    const productRecommendations = data?.productRecommendations || [];

    return new Response(JSON.stringify({productRecommendations}), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    // SECURITY/STABILITY: Log the error internally and return empty
    // This prevents the entire storefront from crashing on API failure.
    console.error('Recommendations API Error:', error);
    
    return new Response(JSON.stringify({productRecommendations: []}), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

const RECOMMENDATIONS_QUERY = `#graphql
  query productRecommendations($productId: ID!, $count: Int) {
    productRecommendations(productId: $productId, intent: RELATED) {
      id
      title
      handle
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
      variants(first: 1) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;
