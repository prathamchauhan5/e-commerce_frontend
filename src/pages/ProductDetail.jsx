import { useParams } from "react-router-dom";
import { useProductDetail } from "@/hooks/useProductDetail";
import { useCartStore } from "@/store/useCartStore";
import { useUserActivityStore } from "@/store/useUserActivityStore";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRelatedProducts } from "@/hooks/useRelatedProducts";
import RelatedProducts from "@/components/product/RelatedProduct";

import { Star, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function ProductDetail() {
  const { id } = useParams();
  const { product, loading } = useProductDetail(id);
  usePageMeta({
    title: product?.title || "Product",
    description: product?.description,
  });
  const { products: relatedProducts, loading: relatedLoading } =
    useRelatedProducts(product?.category, product?.id);

  const addToCart = useCartStore((s) => s.addToCart);
  const loadingItems = useCartStore((s) => s.loadingItems);
  const addViewedProduct = useUserActivityStore((s) => s.addViewedProduct);

  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [thumbnailsLoaded, setThumbnailsLoaded] = useState({});

  useEffect(() => {
    if (product) {
      addViewedProduct({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        discountPercentage: product.discountPercentage || 0,
      });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQty(1);
    setMainImageLoaded(false);
    setThumbnailsLoaded({});
  }, [product]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 animate-pulse">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 w-3/4" />
            <div className="h-4 bg-gray-200 w-1/2" />
            <div className="h-20 bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <p>Product not found</p>;

  const isLoading = loadingItems[product.id];

  const discountedPrice = (
    product.price -
    (product.price * product.discountPercentage) / 100
  ).toFixed(2);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden">
            {!mainImageLoaded && (
              <Skeleton className="absolute inset-0 w-full h-full" />
            )}
            <img
              src={product.images?.[activeImage] || product.thumbnail}
              loading="lazy"
              onLoad={() => setMainImageLoaded(true)}
              className={`w-full h-96 object-cover rounded-xl transition-opacity duration-300 ${
                mainImageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>

          <div className="flex gap-2">
            {product.images?.map((img, i) => (
              <div
                key={i}
                className={`relative w-16 h-16 rounded cursor-pointer border overflow-hidden bg-gray-50 ${
                  i === activeImage ? "border-black" : "border-gray-200"
                }`}
                onClick={() => setActiveImage(i)}>
                {!thumbnailsLoaded[i] && (
                  <Skeleton className="absolute inset-0 w-full h-full" />
                )}
                <img
                  src={img}
                  loading="lazy"
                  onLoad={() =>
                    setThumbnailsLoaded((prev) => ({
                      ...prev,
                      [i]: true,
                    }))
                  }
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    thumbnailsLoaded[i] ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <h1 className="text-2xl font-semibold">{product.title}</h1>

          <p className="text-sm text-gray-500">Brand: {product.brand}</p>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>{product.rating} / 5</span>
          </div>

          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              ${discountedPrice}
            </p>

            <div className="flex items-center gap-3 text-sm">
              <span className="line-through text-gray-400">
                ${product.price}
              </span>

              <span className="text-green-600 font-medium">
                {product.discountPercentage}% OFF
              </span>
            </div>
          </div>

          <p className="text-sm text-green-600">{product.availabilityStatus}</p>

          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-3">
            <span className="text-sm">Quantity</span>

            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-1 hover:bg-gray-100">
                -
              </button>

              <span className="px-4 py-1">{qty}</span>

              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-1 hover:bg-gray-100">
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              for (let i = 0; i < qty; i++) {
                addToCart(product);
              }
            }}
            disabled={isLoading}
            className="bg-black text-white py-3 rounded-md w-full hover:opacity-90">
            {isLoading ? "Adding..." : "Add to Cart"}
          </button>

          {/* Extra Info */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              <span>{product.shippingInformation}</span>
            </div>

            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              <span>{product.returnPolicy}</span>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{product.warrantyInformation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Customer Reviews</h2>

          <div className="space-y-3">
            {product.reviews.slice(0, 3).map((review, i) => (
              <div key={i} className="border p-4 rounded-md">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span className="text-sm">{review.rating}</span>
                </div>

                <p className="text-sm text-gray-700 mt-1">{review.comment}</p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <RelatedProducts products={relatedProducts} loading={relatedLoading} />
    </div>
  );
}
