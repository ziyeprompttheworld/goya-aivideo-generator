import { useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

/**
 * useParallax Hook
 * 
 * Creates a spring-animated parallax offset based on page scroll.
 * 
 * @param distance The maximum displacement in pixels at 1000px scroll.
 * @returns A MotionValue that can be applied to a component's style.
 */
export function useParallax(distance: number = 100): MotionValue<number> {
  const { scrollY } = useScroll();
  
  // Create a transform mapping 0-1000px scroll to 0-distance parallax
  const y = useTransform(scrollY, [0, 1000], [0, distance]);
  
  // Apply a spring for smoothness
  return useSpring(y, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
}
