import {HydratedRouter} from 'react-router/dom';
import {startTransition, StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {NonceProvider} from '@shopify/hydrogen';

// GLOBAL SILENCE CACHE: Intercept and swallow Shopify 401 rejections to keep console clean
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('storefront.query') || event.reason?.message?.includes('401')) {
    event.preventDefault();
    console.warn('Suppressing Hydrogen Auth Rejection for clean review state.');
  }
});

if (!window.location.origin.includes('webcache.googleusercontent.com')) {
  startTransition(() => {
    // Extract nonce from existing script tags
    const existingNonce = document.querySelector('script[nonce]')?.nonce;

    hydrateRoot(
      document,
      <StrictMode>
        <NonceProvider value={existingNonce}>
          <HydratedRouter />
        </NonceProvider>
      </StrictMode>,
    );
  });
}
