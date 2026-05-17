"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@antigravity/ui/Button"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsServicesOpen(false)
  }, [pathname])

  const services = [
    { name: "BIKE SERVICE", href: { pathname: "/booking", query: { service: "bike_service" } } },
    { name: "CAR SERVICE", href: { pathname: "/booking", query: { service: "car_service" } } },
    { name: "CAR AC REPAIR", href: { pathname: "/booking", query: { service: "car_ac_repair" } } },
    { name: "BATTERY", href: { pathname: "/booking", query: { service: "battery" } } },
    { name: "TYRE & WHEEL", href: { pathname: "/booking", query: { service: "tyre_wheel" } } },
    { name: "ENGINE REPAIR", href: { pathname: "/booking", query: { service: "engine_repair" } } },
    { name: "DENTING & PAINTING", href: { pathname: "/booking", query: { service: "denting_painting" } } },
    { name: "EV SERVICE", href: { pathname: "/booking", query: { service: "ev_service" } } },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-grey-200)] bg-[var(--color-white)]">
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between relative bg-[var(--color-white)] z-50">
        <Link href="/" className="text-xl md:text-3xl font-black tracking-tight z-50 relative flex items-center gap-2 md:gap-3 shrink-0">
          <Image src="/NewLogoSvg.svg" alt="RapidFix Logo" width={100} height={100} className="hidden md:block object-contain max-h-12 md:max-h-16 w-auto" />
          <span>RAPID<span className="text-[var(--color-primary)]">FIX</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wider relative z-50">
          <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">HOME</Link>
          <div 
            className="relative"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <Link href="/services" className="hover:text-[var(--color-primary)] transition-colors uppercase cursor-pointer flex items-center h-20">
              SERVICES
            </Link>
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
        <div className="flex items-center gap-2 md:gap-4 z-50 relative shrink-0">
          <a href="https://wa.me/919667891434" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="hidden md:inline-flex border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white">SOS</Button>
          </a>
          <Link href="/booking">
            <Button className="text-xs px-3 h-9 md:text-sm md:px-4 md:h-10">BOOK NOW</Button>
          </Link>
          <button 
            className="md:hidden p-1 text-black hover:text-[var(--color-primary)] transition-colors" 
            aria-label="Menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden w-full bg-[var(--color-white)] border-b border-[var(--color-grey-200)] flex flex-col overflow-hidden"
          >
            <div className="flex flex-col py-4">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-3 font-bold hover:bg-[var(--color-grey-100)]">HOME</Link>
              
              <div className="flex flex-col border-t border-[var(--color-grey-100)]">
                <button 
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="px-6 py-3 font-bold text-left text-gray-500 text-sm hover:bg-[var(--color-grey-100)] flex justify-between items-center"
                >
                  SERVICES
                  <span className="text-xs">{isServicesOpen ? '▲' : '▼'}</span>
                </button>
                <AnimatePresence>
                  {isServicesOpen && (
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: "auto" }} 
                      exit={{ height: 0 }} 
                      className="overflow-hidden flex flex-col gap-3 px-6 pb-3"
                    >
                      {services.map((service, idx) => (
                        <Link
                          key={idx}
                          href={service.href}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsServicesOpen(false);
                          }}
                          className="pl-4 text-sm font-bold text-[var(--color-primary)] py-1 hover:bg-[var(--color-grey-100)]"
                        >
                          {service.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-3 border-t border-[var(--color-grey-100)] font-bold hover:bg-[var(--color-grey-100)]">ABOUT</Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-3 border-t border-[var(--color-grey-100)] font-bold hover:bg-[var(--color-grey-100)]">CONTACT</Link>
              <a 
                href="https://wa.me/919667891434" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)} 
                className="px-6 py-3 border-t border-[var(--color-grey-100)] font-bold text-[var(--color-primary)] hover:bg-[var(--color-grey-100)] flex items-center justify-between"
              >
                SOS EMERGENCY
                <span className="size-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
