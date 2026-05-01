"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@antigravity/ui/Button"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
  const [isServicesOpen, setIsServicesOpen] = useState(false)

  const services = [
    { name: "ENGINE REPAIR", href: { pathname: "/booking", query: { service: "engine_repair" } } },
    { name: "CAR TYRE REPAIR", href: { pathname: "/booking", query: { service: "tyre_repair" } } },
    { name: "OIL CHANGE", href: { pathname: "/booking", query: { service: "oil_change" } } },
    { name: "BODY WORKS", href: { pathname: "/booking", query: { service: "body_works" } } },
    { name: "CAR CLEANING", href: { pathname: "/booking", query: { service: "car_cleaning" } } },
    { name: "BATTERY REPAIR", href: { pathname: "/booking", query: { service: "battery_repair" } } },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-grey-200)] bg-[var(--color-white)]">
      <div className="container mx-auto px-8 h-20 flex items-center justify-between relative">
        <Link href="/" className="text-2xl font-bold tracking-tight z-50 relative flex items-center gap-3">
          <Image src="/logo.png" alt="RapidFix Logo" width={100} height={100} className="object-contain max-h-16" />
          <span>RAPID<span className="text-[var(--color-primary)]">FIX</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wider relative z-50">
          <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">HOME</Link>
          <div 
            className="relative"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <button className="hover:text-[var(--color-primary)] transition-colors uppercase cursor-pointer flex items-center h-20">
              SERVICES
            </button>
            <AnimatePresence>
              {isServicesOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute top-20 left-0 w-80 bg-black/80 backdrop-blur-md border border-white/10 flex flex-col shadow-2xl overflow-hidden"
                >
                  {services.map((service, idx) => (
                    <Link
                      key={idx}
                      href={service.href}
                      className="relative z-0 px-6 py-5 text-base font-black tracking-widest text-[var(--color-primary)] uppercase border-b border-white/5 overflow-hidden group"
                    >
                      <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                        {service.name}
                      </span>
                      {/* Left-to-right fill animation */}
                      <div className="absolute inset-0 bg-[var(--color-primary)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-[-1]" />
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link href="/about" className="hover:text-[var(--color-primary)] transition-colors">ABOUT</Link>
          <Link href="/contact" className="hover:text-[var(--color-primary)] transition-colors">CONTACT</Link>
        </nav>
        <div className="flex items-center gap-4 z-50 relative">
          <Link href="/contact">
            <Button variant="outline" className="hidden md:inline-flex border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white">SOS</Button>
          </Link>
          <Link href="/booking">
            <Button>BOOK ONLINE</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
