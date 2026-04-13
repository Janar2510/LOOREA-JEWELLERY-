import {Link, useNavigate} from 'react-router';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';

/**
 * @param {{
 *   productOptions: MappedProductOptions[];
 *   selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 * }}
 */
export function ProductForm({productOptions, selectedVariant}) {
  const navigate = useNavigate();
  const {open} = useAside();
  return (
    <div className="space-y-8">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div className="space-y-4" key={option.name}>
            <h5 className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 font-medium">
              {option.name}
            </h5>
            <div className="flex flex-wrap gap-3">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const commonClasses = clsx(
                  "px-4 py-2 text-[10px] uppercase tracking-widest border transition-all duration-300",
                  selected ? "border-accent text-accent" : "border-foreground/10 text-foreground/60 hover:border-foreground/30 hover:text-foreground",
                  !available && "opacity-30 cursor-not-allowed strike-through"
                );

                if (isDifferentProduct) {
                  return (
                    <Link
                      className={commonClasses}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      className={commonClasses}
                      key={option.name + name}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
      
      <div className="pt-4">
        <AddToCartButton
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          className="w-full bg-foreground text-background py-4 text-xs uppercase tracking-[0.4em] font-medium transition-all hover:bg-accent hover:text-white disabled:bg-foreground/10 disabled:text-foreground/30"
          onClick={() => {
            open('cart');
          }}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                    selectedVariant,
                  },
                ]
              : []
          }
        >
          {selectedVariant?.availableForSale ? 'Add to bag' : 'Sold out'}
        </AddToCartButton>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   swatch?: Maybe<ProductOptionValueSwatch> | undefined;
 *   name: string;
 * }}
 */
function ProductOptionSwatch({swatch, name}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Maybe} Maybe */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').ProductOptionValueSwatch} ProductOptionValueSwatch */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
