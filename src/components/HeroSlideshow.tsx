"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft } from "lucide-react"

const SLIDES = [
  { id: 1, image: "/engine.webp", title: "PRECISION ENGINEERING" },
  { id: 2, image: "/sanding.webp", title: "FLAWLESS EXTERIORS" },
  { id: 3, image: "/lifted up.webp", title: "ADVANCED DIAGNOSTICS" },
  { id: 4, image: "/oil.webp", title: "PREMIUM MAINTENANCE" },
]

export function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  const goToSlide = (index: number) => setCurrentSlide(index)

  return (
    <div className="relative w-full h-[80vh] min-h-[600px] bg-black overflow-hidden group">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${SLIDES[currentSlide].image}')` }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-8 h-full flex flex-col justify-center items-center text-center">
        <motion.h1
          key={`title-${currentSlide}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight uppercase max-w-5xl tracking-tight"
        >
          {SLIDES[currentSlide].title.split(" ").map((word, i) => (
            <span key={i} className={i % 2 !== 0 ? "text-[var(--color-primary)] block" : "block"}>
              {word}
            </span>
          ))}
        </motion.h1>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 z-20 flex">
        <button
          onClick={prevSlide}
          className="w-14 h-14 text-white/50 flex items-center justify-center hover:text-white transition-colors hover:scale-110"
          aria-label="Previous slide"
        >
          <ArrowLeft size={40} strokeWidth={1.5} />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 z-20 flex">
        <button
          onClick={nextSlide}
          className="w-14 h-14 text-white/50 flex items-center justify-center hover:text-white transition-colors hover:scale-110"
          aria-label="Next slide"
        >
          <ArrowRight size={40} strokeWidth={1.5} />
        </button>
      </div>

      {/* Number Pagination */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-6">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`text-lg font-black tracking-widest transition-all ${
              currentSlide === index
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] pb-1"
                : "text-white/50 hover:text-white border-b-2 border-transparent pb-1"
            }`}
          >
            0{index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
