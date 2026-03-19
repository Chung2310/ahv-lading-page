import { useEffect, useRef, useState } from "react";

export const useInViewAnimation = (options?: IntersectionObserverInit) => {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Stabilize around the threshold to avoid flicker/re-render loops.
        // Using intersectionRatio + only updating state on change prevents rapid toggling.
        const threshold =
          typeof (options as any)?.threshold === "number" ? ((options as any).threshold as number) : 0.3;
        const next = entry.isIntersecting && entry.intersectionRatio >= threshold;
        setInView((prev) => (prev === next ? prev : next));
      },
      { threshold: 0.3, ...(options || {}) }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  const baseTransition = "transition-all duration-700 ease-out";

  const animationClass = inView
    ? `${baseTransition} opacity-100 translate-y-0 scale-100`
    : `${baseTransition} opacity-0 translate-y-4 scale-[0.99]`;

  return { ref, inView, animationClass };
};

