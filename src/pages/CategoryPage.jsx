import ProductListing from "@/components/product/ProductListing";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useParams } from "react-router-dom";

export default function CategoryPage() {
  const { category } = useParams();
  usePageMeta({
    title: category,
    description: `Browse ${category} products`,
  });
  return <ProductListing />;
}
