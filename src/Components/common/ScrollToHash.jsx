import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Drop this once near ScrollToTop in AppRoutes.jsx.
 * Whenever the URL has a hash (e.g. /home#deals), scrolls that element
 * into view. Runs on a tiny delay so it fires after the page's content
 * (and images) have had a chance to lay out - otherwise it can scroll to
 * the wrong spot if the page height changes right after navigation.
 */
const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const timer = setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => clearTimeout(timer);
  }, [location]);

  return null;
};

export default ScrollToHash;
