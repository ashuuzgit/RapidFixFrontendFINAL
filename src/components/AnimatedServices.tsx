"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { LinkCard } from "@/components/ui/link-card"
import { Button } from "@/components/ui/Button"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    id: "bike_service",
    title: "Bike Service",
    emoji: "🏍️",
    description: "Regular maintenance, oil change, tune-up",
  },
  {
    id: "car_service",
    title: "Car Service",
    emoji: "🚗",
    description: "Periodic service, engine care, inspections",
  },
  {
    id: "car_ac_repair",
    title: "Car AC Repair",
    emoji: "❄️",
    description: "Car AC gas refill, compressor, cooling fix",
  },
  {
    id: "battery",
    title: "Battery",
    emoji: "🔋",
    description: "Jump start, replacement, testing",
  },
  {
    id: "tyre_wheel",
    title: "Tyre & Wheel",
    emoji: "🛞",
    description: "Puncture, replacement, alignment",
  },
  {
    id: "engine_repair",
    title: "Engine Repair",
    emoji: "🔧",
    description: "Diagnostics, overhaul, performance",
  },
  {
    id: "denting_painting",
    title: "Denting & Painting",
    emoji: "🎨",
    description: "Scratch removal, body work, polish",
  },
  {
    id: "ev_service",
    title: "EV Service",
    emoji: "⚡",
    description: "Electric bike & scooter service from ₹999",
  },
]

export function AnimatedServices() {
  const router = useRouter()
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.service-card')
    if (!cards.length) return

    // Set initial z-indexes so the first card is on top
    cards.forEach((card, i) => {
      gsap.set(card, { zIndex: cards.length - i })
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%", // Starts when section is 40% into view
        end: "top 0%",   // Ends when section top hits top of viewport
        scrub: 2, // Smooth, slow lag behind the scroll (2 seconds) ensures it feels slow even if scrolled fast
      }
    })

    tl.from(cards, {
      x: (index, target) => {
        if (!containerRef.current) return 0
        const containerRect = containerRef.current.getBoundingClientRect()
        const targetRect = target.getBoundingClientRect()
        const bundleX = containerRect.left + containerRect.width / 2
        const targetCenterX = targetRect.left + targetRect.width / 2
        return bundleX - targetCenterX
      },
      y: (index, target) => {
        if (!containerRef.current) return 0
        const targetRect = target.getBoundingClientRect()
        const containerRect = containerRef.current.getBoundingClientRect()
        // Bundle them vertically at a fixed point below the container
        const bundleY = containerRect.top + containerRect.height / 2 + window.innerHeight * 0.6
        const targetCenterY = targetRect.top + targetRect.height / 2
        return bundleY - targetCenterY
      },
      rotation: (index) => (index % 2 === 0 ? 1 : -1) * (index * 3),
      scale: 0.6,
      opacity: 0,
      stagger: 0.01,
      ease: "power3.out",
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="w-full border-b-2 border-[var(--color-black)] relative z-10 bg-[var(--color-grey-100)] py-16 md:py-24 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-black opacity-5 uppercase tracking-tighter whitespace-nowrap z-[-1] pointer-events-none text-black">
        OUR SERVICES
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-[var(--color-black)] mb-6 md:mb-0">
            Explore Our Services
          </h2>
          <Button 
            className="hidden md:flex group" 
            onClick={() => router.push('/booking')}
            variant="outline"
          >
            VIEW ALL <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Desktop Grid & Mobile Horizontal Scroll */}
        <div className="flex md:grid overflow-x-auto md:overflow-visible gap-4 md:gap-6 pb-8 md:pb-0 snap-x snap-mandatory hide-scrollbar md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, idx) => (
            <div key={idx} className="service-card snap-center shrink-0 w-[85vw] md:w-auto relative">
              <LinkCard
                emoji={service.emoji}
                title={service.title}
                description={service.description}
                href={`/booking?service=${service.id}`}
              />
            </div>
          ))}
          
          {/* Mobile "View All" Button at the end of scroll */}
          <div className="md:hidden snap-center shrink-0 w-[85vw] flex items-center justify-center p-4">
            <Button 
              className="w-full h-full min-h-[200px] border-2 border-[var(--color-black)] bg-white text-[var(--color-black)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-colors text-xl font-black group"
              onClick={() => router.push('/booking')}
            >
              VIEW ALL SERVICES <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  )
}

