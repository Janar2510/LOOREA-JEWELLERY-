import {Image} from '@shopify/hydrogen';

/**
 * @param {{
 *   image: ProductVariantFragment['image'];
 * }}
 */
export function ProductImage({image}) {
  if (!image) {
    return <div className="aspect-square bg-muted rounded-sm" />;
  }
  return (
    <div className="md:sticky md:top-24 w-full aspect-square overflow-hidden bg-muted rounded-sm">
      <Image
        alt={image.altText || 'Product Image'}
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
        className="w-full h-full object-cover transition-all duration-700"
      />
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
