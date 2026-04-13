import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

/**
 * @param {Request} request
 * @param {number} responseStatusCode
 * @param {Headers} responseHeaders
 * @param {EntryContext} reactRouterContext
 * @param {HydrogenRouterContextProvider} context
 */
export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  reactRouterContext,
  context,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    imgSrc: [
      'self',
      'https://cdn.shopify.com',
      'http://localhost:*',
      'data:',
    ],
    fontSrc: ['self', 'https://fonts.gstatic.com', 'http://localhost:*'],
    scriptSrc: [
      'self',
      'http://localhost:*',
      'unsafe-inline',
      'unsafe-eval',
    ],
    connectSrc: [
      'self',
      'http://localhost:*',
      'ws://localhost:*',
      'wss://localhost:*',
    ],
    styleSrc: [
      'self',
      'https://fonts.googleapis.com',
      'http://localhost:*',
      'unsafe-inline',
    ],
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
  });

  const body = await renderToReadableStream(
    <NonceProvider value={nonce}>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  
  // ABSOLUTE BYPASS FOR LOCAL DEVELOPMENT
  // If we are on localhost, we do NOT set the CSP header to ensure nothing is blocked.
  const isLocal = new URL(request.url).hostname === 'localhost';
  
  if (!isLocal) {
    responseHeaders.set('Content-Security-Policy', header);
  } else {
    // Optional: Set a very loose one if no-header causes issues with some browsers
    responseHeaders.set('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; img-src * data: blob:; style-src * 'unsafe-inline'; font-src * data:;");
  }

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

/** @typedef {import('@shopify/hydrogen').HydrogenRouterContextProvider} HydrogenRouterContextProvider */
/** @typedef {import('react-router').EntryContext} EntryContext */
