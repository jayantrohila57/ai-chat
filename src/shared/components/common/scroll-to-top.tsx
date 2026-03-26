"use client";

import { ArrowUpCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "../ui/button";

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollY } = window;
      const threshold = 300;
      setIsVisible(scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {isVisible && (
        <Button size="icon" onClick={() => scrollToTop()}>
          <ArrowUpCircle className="fill-primary transition-all duration-300" />
        </Button>
      )}
    </div>
  );
}

export default ScrollToTopButton;
