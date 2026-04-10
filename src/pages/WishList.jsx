import { useWishlistStore } from "@/store/useWishListStore";
import ProductCard from "@/components/product/ProductCard";
import { Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Wishlist() {
  const wishlist = useWishlistStore((s) => s.wishlist);
  usePageMeta({
    title: "Wishlist",
    description: "Your saved products",
  });

  if (wishlist.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-10 text-center space-y-4">
        <h1 className="text-xl font-semibold">Your Wishlist is empty</h1>

        <p className="text-gray-500 text-sm">
          Save items you love to view them later
        </p>

        <Link
          to="/"
          className="inline-block bg-black text-white px-6 py-2 rounded-md">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold">Your Wishlist</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
