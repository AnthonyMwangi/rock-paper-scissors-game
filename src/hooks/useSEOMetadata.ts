import { useCallback, useEffect } from "react";

export const useSEOComponent = () => {
  const updateMetaTag = useCallback(
    (name: string, values: Record<string, number | string | boolean>) => {
      let tag = document.querySelector(`meta[property="${name}"]`);

      // Try and query using the name attribute
      if (!tag) {
        tag = document.querySelector(`meta[name="${name}"]`);
      }

      // Create the tag if it does not exist yet
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", name);
        document.head.appendChild(tag);
      }

      // Update the tag attributes
      Object.entries(values).forEach(([attributeName, attributeValue]) => {
        tag.setAttribute(attributeName, attributeValue.toString());
      });

      return tag;
    },
    [],
  );

  useEffect(() => {
    updateMetaTag("twitter:url", { content: window.location.href });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
