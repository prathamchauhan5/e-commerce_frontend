import ProductListing from "@/components/product/ProductListing";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useParams } from "react-router-dom";

export default function SearchPage() {
  const { q } = useParams();
  usePageMeta({
    title: `Search "${q}"`,
    description: `Results for ${q}`,
  });
  return <ProductListing />;
}
