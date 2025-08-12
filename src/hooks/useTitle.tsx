import { useLayoutEffect } from "react";

const useDocumentMeta = ({
  title = "React App",
  description = "",
  keywords = "",
  ogTitle = "",
  ogDescription = "",
  robots = "index, follow",
}) => {
  useLayoutEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const setMeta = (name = "", content = "", attr = "name") => {
      if (!content) return;
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("robots", robots);
    setMeta("og:title", ogTitle, "property");
    setMeta("og:description", ogDescription, "property");

    return () => {
      document.title = previousTitle;
    };
  }, [title, description, keywords, ogTitle, ogDescription, robots]);
};

export default useDocumentMeta;
