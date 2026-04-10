import { useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { searchProducts } from "@/api/product";
import { useCartStore } from "@/store/useCartStore";
import { useUserActivityStore } from "@/store/useUserActivityStore";
import { useWishlistStore } from "@/store/useWishListStore";

export default function Navbar() {
  const cart = useCartStore((state) => state.cart);
  const openCart = useCartStore((s) => s.openCart);
  const wishlist = useWishlistStore((s) => s.wishlist);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const location = useLocation();
  const addSearch = useUserActivityStore((s) => s.addSearch);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (!query.trim()) return;

      navigate(`/search?q=${query}`);
      addSearch(query);
      setSuggestions([]);
      setQuery("");
    }
  };

  useEffect(() => {
    if (location.pathname === "/search") {
      inputRef.current?.blur();
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const data = await searchProducts(query);
        setSuggestions(data.products?.slice(0, 5) || []);
      } catch (err) {
        console.error(err);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 p-4 relative">
        {/* Logo */}
        <Link to="/" className="text-lg font-semibold">
          Shop
        </Link>

        {/* Search */}
        <div className="relative w-full max-w-sm">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="border rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border rounded-md shadow-md z-50 max-h-64 overflow-auto">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    navigate(`/product/${item.id}`);
                    setQuery("");
                    setSuggestions([]);
                    inputRef.current?.blur();
                  }}>
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <span className="text-sm">{item.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Wishlist */}
          <Link to="/wishlist" className="relative">
            <Heart className="w-5 h-5 hover:text-red-500 transition" />

            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Button variant="outline" onClick={openCart}>
            <div className="relative">
              <ShoppingCart />

              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded">
                  {totalItems}
                </span>
              )}
            </div>
          </Button>
        </div>
      </div>
    </nav>
  );
}
