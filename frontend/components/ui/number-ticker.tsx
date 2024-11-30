"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, motion } from "framer-motion";

import { cn } from "@/lib/utils";

export default function NumberTicker({
  prizeFund,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  symbol = "$",
}: {
  prizeFund: number | undefined;
  direction?: "up" | "down";
  className?: string;
  delay?: number; // delay in s
  decimalPlaces?: number;
  symbol?: string;
}) {
  const value = prizeFund ?? 0;
  const loading = prizeFund === undefined;

  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    isInView &&
      setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent =
            symbol +
            Intl.NumberFormat("en-US", {
              minimumFractionDigits: decimalPlaces,
              maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces)));
        }
      }),
    [springValue, decimalPlaces, symbol]
  );

  return (
    <motion.span
      className={cn("inline-block tabular-nums tracking-wider", className)}
      ref={ref}
      animate={loading ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
      transition={loading ? { duration: 1, repeat: Infinity } : {}}
    >
      {symbol}
      {Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }).format(direction === "down" ? value : 0)}
    </motion.span>
  );
}
