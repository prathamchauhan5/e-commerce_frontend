import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import { getProductsByCategory, searchProducts } from "@/api/product";
import { buildParams } from "@/utils/parambuilder";
import { useUserActivityStore } from "@/store/useUserActivityStore";

export default function ProductListing() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const addCategory = useUserActivityStore((s) => s.addCategory);

  // params
  const paramsObj = Object.fromEntries(searchParams.entries());

  const ratingParam = paramsObj.rating;
  const rating = ratingParam ? Number(ratingParam) : 0;

  const q = paramsObj.q || "";
  const sort = paramsObj.sort || "";

  const limit = paramsObj.limit ? Number(paramsObj.limit) : 12;
  const skip = paramsObj.skip ? Number(paramsObj.skip) : 0;

  const minPriceParam = paramsObj.minPrice;
  const maxPriceParam = paramsObj.maxPrice;

  const minPrice = minPriceParam ? Number(minPriceParam) : 0;
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : Infinity;

  // local input state
  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // sync URL → input
  useEffect(() => {
    setMinInput(minPriceParam || "");
    setMaxInput(maxPriceParam || "");
  }, [minPriceParam, maxPriceParam]);

  // fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        let data;

        if (q) {
          data = await searchProducts(q, { limit, skip });
        } else {
          data = await getProductsByCategory(category, {
            limit,
            skip,
          });
        }

        setProducts(data.products || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q, category, limit, skip]);

  // filtering + sorting
  const filteredProducts = useMemo(() => {
    let list = [...products];

    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);
    if (rating > 0) {
      list = list.filter((p) => p.rating >= rating);
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "title-asc")
      list.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "title-desc")
      list.sort((a, b) => b.title.localeCompare(a.title));

    return list;
  }, [products, sort, minPrice, maxPrice, rating]);

  // handlers (using buildParams directly)

  const handlePrev = () => {
    const newSkip = Math.max(skip - limit, 0);

    setSearchParams(
      buildParams({
        ...paramsObj,
        skip: newSkip,
      }),
    );
  };

  const handleNext = () => {
    const newSkip = skip + limit;

    setSearchParams(
      buildParams({
        ...paramsObj,
        skip: newSkip,
      }),
    );
  };

  const handleSortChange = (value) => {
    setSearchParams(
      buildParams({
        ...paramsObj,
        sort: value,
        skip: 0,
      }),
    );
  };

  const applyFilters = () => {
    setSearchParams(
      buildParams({
        ...paramsObj,
        minPrice: minInput,
        maxPrice: maxInput,
        skip: 0,
      }),
    );
  };

  const clearFilters = () => {
    setSearchParams(
      buildParams({
        ...paramsObj,
        minPrice: undefined,
        maxPrice: undefined,
        rating: undefined,
        skip: undefined,
      }),
    );
  };

  const page = skip / limit + 1;
  const hasFilters = minPriceParam || maxPriceParam || ratingParam;

  useEffect(() => {
    if (category) {
      addCategory(category);
    }
  }, [category]);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500">
        <Link to="/" className="hover:underline text-gray-700">
          Home
        </Link>{" "}
        / {q ? `Search "${q}"` : category?.replace(/-/g, " ")}
      </p>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold capitalize">
            {q ? `Search results for "${q}"` : category}
          </h1>

          {loading ? (
            <div className="text-sm text-gray-500">
              <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              {filteredProducts.length} products found
            </p>
          )}
        </div>

        {/* Sorting */}
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm">
          <option value="">Sort</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="title-asc">Name: A to Z</option>
          <option value="title-desc">Name: Z to A</option>
        </select>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Filter Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700">Filters</h3>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-red-500 hover:underline">
              Clear all filters
            </button>
          )}
        </div>

        {/* Price Filter */}
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm text-gray-600">Price:</span>

          <input
            type="number"
            placeholder="Min"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm w-24"
          />

          <input
            type="number"
            placeholder="Max"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm w-24"
          />

          <button
            onClick={applyFilters}
            className="px-3 py-2 bg-black text-white rounded-md text-sm">
            Apply
          </button>
        </div>

        {/* Rating Filter */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Rating:</span>

          <select
            value={ratingParam || ""}
            onChange={(e) =>
              setSearchParams(
                buildParams({
                  ...paramsObj,
                  rating: e.target.value || undefined,
                  skip: 0,
                }),
              )
            }
            className="border px-3 py-2 rounded-md text-sm">
            <option value="">All</option>
            <option value="4">4★ & above</option>
            <option value="3">3★ & above</option>
            <option value="2">2★ & above</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filteredProducts.length === 0 && (
        <p className="text-center text-gray-500">
          {q
            ? `No products found for "${q}"`
            : `No products found in ${category?.replace(/-/g, " ")}`}
        </p>
      )}

      {/* Grid */}
      {!loading && filteredProducts.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={handlePrev}
              disabled={skip === 0}
              className="px-4 h-10 border rounded-md disabled:opacity-50 hover:bg-gray-100">
              Prev
            </button>

            <span className="text-sm text-gray-600">Page {page}</span>

            <button
              onClick={handleNext}
              disabled={skip + limit >= total}
              className="px-4 h-10 border rounded-md disabled:opacity-50 hover:bg-gray-100">
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
