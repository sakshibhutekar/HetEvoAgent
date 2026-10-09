"use client"

import { useEffect, useRef } from "react"
import { animate } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  decimals?: number
}

export function AnimatedCounter({ value, decimals = 0 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
      onUpdate(value) {
        node.textContent = value.toFixed(decimals)
      },
    })

    return () => controls.stop()
  }, [value, decimals])

  return <span ref={ref}>0</span>
}
