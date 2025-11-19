import { useEffect } from "react";

const ScrollToTop = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []); // Runs every time the route changes

  return null;
};

export default ScrollToTop;
