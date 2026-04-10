import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import { getAllCategories } from "@/api/product";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchActivitySection from "@/components/activity/SearchActivitySection";
import CategoryActivitySection from "@/components/activity/CategoryActivitySection";
import ViewedProductsSection from "@/components/activity/ViewedProductsSection";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Home() {
  const { products, loading, error } = useProducts();
  const [categories, setCategories] = useState({
    isLoading: true,
    data: [],
  });
  const navigate = useNavigate();
  
  usePageMeta({
    title: "Home",
    description: "Discover the best products at great prices",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories({ isLoading: false, data });
      } catch (err) {
        console.error(err);
        setCategories({ isLoading: false, data: [] });
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="p-6 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl">
        <h2 className="text-xl font-semibold">Welcome to Shop</h2>
        <p className="text-sm text-gray-600">
          Find the best products at great prices
        </p>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        {categories.isLoading && categories.data.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.data.slice(0, 8).map((cat) => (
              <div
                key={cat}
                onClick={() => navigate(`/category/${cat}`)}
                className="p-4 rounded-xl bg-white border hover:shadow-md transition cursor-pointer group">
                <h2 className="text-sm font-medium text-gray-800 group-hover:text-black capitalize">
                  {cat.replace(/-/g, " ")}
                </h2>
              </div>
            ))}
          </div>
        )}
      </div>
      <SearchActivitySection />
      <CategoryActivitySection />
      <ViewedProductsSection />
      {/* Products */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Products</h2>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Product Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
