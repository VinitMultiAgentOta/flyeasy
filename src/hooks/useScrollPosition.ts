import { useState, useEffect } from "react";

export function useScrollPosition(threshold = 80) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY]       = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setIsScrolled(y > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return { isScrolled, scrollY };
}
