import { useEffect, useState } from "react";
import { useUserActivityStore } from "@/store/useUserActivityStore";
import { searchProducts } from "@/api/product";
import ActivitySection from "./ActivitySection";

export default function SearchActivitySection() {
  const { searches } = useUserActivityStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const latestQuery = searches[0];

  useEffect(() => {
    if (!latestQuery) return;

    const fetch = async () => {
      setLoading(true);
      const data = await searchProducts(latestQuery);
      setProducts(data.products || []);
      setLoading(false);
    };

    fetch();
  }, [latestQuery]);

  return (
    <>
      {products.length > 0 && (
        <ActivitySection
          title={`Continue searching "${latestQuery}"`}
          products={products}
          loading={loading}
          viewAllLink={`/search?q=${latestQuery}`}
        />
      )}
    </>
  );
}
