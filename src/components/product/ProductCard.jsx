import { memo, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { getDiscountedPrice } from "@/utils/price";
import { Heart, Star } from "lucide-react";
import { useWishlistStore } from "@/store/useWishListStore";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, loadingItems } = useCartStore();
  const [imageLoaded, setImageLoaded] = useState(false);

  const isInWishlist = useWishlistStore((s) =>
    s.isInWishlist(product.id)
  );
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);

  const isLoading = loadingItems[product.id];

  const discountedPrice = getDiscountedPrice(
    product.price,
    product.discountPercentage
  );

  // ⭐ Rating renderer
  const renderStars = (rating = 0) => {
    return Array.from({ length: 5 }).map((_, i) => {
      const isFilled = i < Math.round(rating);

      return (
        <Star
          key={i}
          className={`w-4 h-4 ${
            isFilled
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      );
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition cursor-pointer">
      
      {/* Image Section */}
      <div
        className="aspect-square overflow-hidden relative bg-gray-100"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white shadow hover:scale-105 transition"
        >
          <Heart
            className={`w-4 h-4 transition ${
              isInWishlist
                ? "fill-red-500 text-red-500"
                : "text-gray-400"
            }`}
          />
        </button>

        {!imageLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}

        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-2">
        {/* Title */}
        <h2 className="text-sm font-medium line-clamp-2">
          {product.title}
        </h2>

        {/* ⭐ Rating */}
        <div className="flex items-center gap-1">
          {renderStars(product.rating)}
          <span className="text-xs text-gray-500 ml-1">
            {product.rating?.toFixed(1)}
          </span>
        </div>

        {/* Price */}
        <div className="space-y-1">
          <p className="text-base font-semibold text-gray-900">
            ${discountedPrice}
          </p>

          {product.discountPercentage > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 line-through">
                ${product.price}
              </span>

              <span className="font-medium text-green-600">
                {Math.round(product.discountPercentage)}% OFF
              </span>
            </div>
          )}
        </div>

        {/* Add to Cart */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          disabled={isLoading}
          className="w-full bg-black text-white py-2 rounded-md"
        >
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default memo(ProductCard);