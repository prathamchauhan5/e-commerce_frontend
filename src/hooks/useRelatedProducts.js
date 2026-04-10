import { useEffect, useState } from "react";
import { getProductsByCategory } from "@/api/product";

export const useRelatedProducts = (category, currentId) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    const fetch = async () => {
      setLoading(true);

      try {
        const data = await getProductsByCategory(category, {
          limit: 8,
        });

        const filtered =
          data.products?.filter((p) => p.id !== currentId) || [];

        setProducts(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [category, currentId]);

  return { products, loading };
};