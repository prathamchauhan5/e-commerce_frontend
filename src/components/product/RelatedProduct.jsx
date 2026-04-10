import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";

export default function RelatedProducts({ products = [], loading }) {
  if (!loading && products.length === 0) return null;

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
          You may also like
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="transition-transform duration-200 hover:-translate-y-1">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
