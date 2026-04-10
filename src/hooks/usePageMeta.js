import { useEffect } from "react";

export const usePageMeta = ({ title, description }) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Shop`;
    }

    let meta = document.querySelector("meta[name='description']");

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }

    meta.content = description || "Browse products and find the best deals";

    return () => {
      if (title) {
        document.title = "Shop";
      }
    };
  }, [title, description]);
};
