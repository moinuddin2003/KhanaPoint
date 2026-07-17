import { useEffect } from "react";
import { useLocation } from "react-router";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Jaise hi URL ka rasta (pathname) badle, scroll zero kar do
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Yeh component kuch render nahi karega, sirf apna kaam karega
}
