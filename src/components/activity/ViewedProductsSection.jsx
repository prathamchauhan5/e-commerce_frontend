import { useUserActivityStore } from "@/store/useUserActivityStore";
import ActivitySection from "./ActivitySection";

export default function ViewedProductsSection() {
  const { viewedProducts } = useUserActivityStore();

  return (
    <ActivitySection
      title="Recently Viewed"
      products={viewedProducts}
      loading={false}
    />
  );
}