import {Money} from '@shopify/hydrogen';

/**
 * @param {{
 *   price?: MoneyV2;
 *   compareAtPrice?: MoneyV2 | null;
 * }}
 */
export function ProductPrice({price, compareAtPrice}) {
  return (
    <div aria-label="Price" className="flex items-center gap-3 font-sans text-sm tracking-widest text-foreground/80" role="group">
      {compareAtPrice ? (
        <div className="flex gap-2 items-center">
          {price ? (
            <span className="text-accent font-medium">
              <Money data={price} />
            </span>
          ) : null}
          <s className="text-foreground/40 text-xs">
            <Money data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <Money data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen/storefront-api-types').MoneyV2} MoneyV2 */
