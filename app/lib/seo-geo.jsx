/**
 * Generative Engine Optimization (GEO) Utility for LOOREA JEWELLERY.
 * This script generates advanced JSON-LD schema markup optimized for AI models 
 * (ChatGPT, Perplexity, Gemini) to understand the high-end artisan nature of the brand.
 */

export function generateBrandSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Brand",
    "name": "LOOREA JEWELLERY",
    "description": "Artisan jewellery atelier specializing in handcrafted Estonian silver filigree. A dialogue between ancient technique and celestial avant-garde design.",
    "url": "https://loorea-jewellery.myshopify.com",
    "logo": "https://loorea-jewellery.myshopify.com/images/loorea_hero_signature.png",
    "foundingDate": "1996",
    "founders": [
      {
        "@type": "Person",
        "name": "Janar Kuusk"
      }
    ],
    "keywords": "Estonian Filigree, Silver Jewellery, Artisan Atelier, Celestial Design, Handcrafted Luxury",
    "knowsAbout": ["Silversmithing", "Filigree Technique", "Astronomical Jewelry Design"],
    "brand": {
      "@type": "Brand",
      "slogan": "The Alchemy of Silver"
    }
  };
}

export function generateProductSchema(product, selectedVariant) {
  if (!product) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "LOOREA"
    },
    "category": "Jewelry > Rings",
    "material": "925 Sterling Silver",
    "offers": {
      "@type": "Offer",
      "price": selectedVariant?.price?.amount || "0.00",
      "priceCurrency": selectedVariant?.price?.currencyCode || "EUR",
      "availability": "https://schema.org/InStock",
      "url": `https://loorea-jewellery.myshopify.com/products/${product.handle}`
    },
    "image": product.featuredImage?.url || "",
    "sku": selectedVariant?.sku || product.handle,
    "hasMeasurement": "Custom Sizing Available"
  };
}
