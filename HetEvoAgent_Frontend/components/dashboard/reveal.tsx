"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

type RevealProps = {
  children: ReactNode
  delay?: number
  y?: number
  x?: number
  className?: string
  as?: "div" | "article" | "section" | "li"
}

/**
 * Mount-based reveal. Uses `animate` (not `whileInView`) so content is
 * guaranteed to become visible even when it renders below the fold or when an
 * IntersectionObserver never fires (e.g. full-page screenshots, prerender).
 */
export function Reveal({
  children,
  delay = 0,
  y = 10,
  x = 0,
  className,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as]

  return (
    <MotionTag
      initial={reduce ? false : { opacity: 0, x, y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}
