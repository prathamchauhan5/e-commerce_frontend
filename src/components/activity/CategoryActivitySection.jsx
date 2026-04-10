import { useEffect, useState } from "react";
import { useUserActivityStore } from "@/store/useUserActivityStore";
import { getProductsByCategory } from "@/api/product";
import ActivitySection from "./ActivitySection";

export default function CategoryActivitySection() {
  const { categories } = useUserActivityStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const latestCategory = categories[0];

  useEffect(() => {
    if (!latestCategory) return;

    const fetch = async () => {
      setLoading(true);
      const data = await getProductsByCategory(latestCategory, {
        limit: 8,
      });
      setProducts(data.products || []);
      setLoading(false);
    };

    fetch();
  }, [latestCategory]);

  return (
    <>
      {products.length > 0 && (
        <ActivitySection
          title={`Explore more in ${latestCategory}`}
          products={products}
          loading={loading}
          viewAllLink={`/category/${latestCategory}`}
        />
      )}
    </>
  );
}
