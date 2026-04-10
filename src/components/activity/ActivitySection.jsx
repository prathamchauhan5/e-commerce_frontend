import { Link } from "react-router-dom";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";

export default function ActivitySection({
  title,
  products = [],
  loading,
  viewAllLink,
}) {
  if (!loading && products.length === 0) return null;

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          {title}
        </h2>

        {!loading && products.length > 0 && viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-sm text-gray-500 hover:text-black transition">
            View all
          </Link>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
