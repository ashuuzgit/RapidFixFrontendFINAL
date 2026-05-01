"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowRight, Settings, Battery, Wrench, Zap } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  { 
    id: "full_system_restoration",
    title: "FULL SYSTEM RESTORATION", 
    icon: <Settings className="w-8 h-8" />, 
    desc: "End-to-end computational diagnostics and physical restoration utilizing proprietary performance protocols.",
    action: "VIEW LAB SPECIFICATIONS"
  },
  { 
    id: "energy_systems",
    title: "ENERGY SYSTEMS", 
    icon: <Battery className="w-8 h-8" />, 
    desc: "Cell-level analysis and voltage optimization for next-generation propulsion systems.",
    action: "STATUS: OPERATIONAL"
  },
  { 
    id: "bespoke_integration",
    title: "BESPOKE INTEGRATION", 
    icon: <Wrench className="w-8 h-8" />, 
    desc: "Custom-machined components installed with aerospace tolerances for ultimate reliability.",
    action: "INITIATE SEQUENCE"
  },
  { 
    id: "thermal_dynamics",
    title: "THERMAL DYNAMICS", 
    icon: <Zap className="w-8 h-8" />, 
    desc: "Advanced cooling management and heat dissipation tuning for extreme conditions.",
    action: "EXPLORE MATRIX"
  }
]

export function AnimatedServices() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const cards = gsap.utils.toArray('.service-card')
    
    gsap.from(cards, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="border-b-2 border-black relative z-10 bg-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-black opacity-5 uppercase tracking-tighter whitespace-nowrap z-[-1] pointer-events-none text-black">
        CARE & SERVICE
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
        {SERVICES.map((service, idx) => {
          const isBlackStart = idx === 2 || idx === 3;
          const baseClass = isBlackStart ? "bg-black text-white" : "bg-white text-black";
          const hoverClass = isBlackStart ? "hover:bg-white hover:text-black" : "hover:bg-black hover:text-white";

          return (
            <Link 
              key={idx} 
              href={{ pathname: "/booking", query: { service: service.id } }}
              className={`service-card m-4 p-8 md:p-16 flex flex-col justify-between transition-all duration-500 hover:scale-[1.03] group cursor-pointer border-2 border-black ${baseClass} ${hoverClass}`}
            >
              <div>
                <div className="mb-12 text-[var(--color-primary)]">
                  {service.icon}
                </div>
                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6">
                  {service.title}
                </h3>
                <p className="opacity-70 font-medium max-w-sm text-lg leading-relaxed mb-16">
                  {service.desc}
                </p>
              </div>
              <div className="flex items-center gap-4 text-[var(--color-primary)] font-black tracking-widest text-xs uppercase mt-auto">
                {service.action} <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
