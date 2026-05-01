 "use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

const PHASES = [
  { title: "Consultation", step: "PHASE 1", desc: "Assessing goals and vehicle state." },
  { title: "Diagnostics", step: "PHASE 2", desc: "Comprehensive physical inspection." },
  { title: "Engineering", step: "PHASE 3", desc: "Precision repairs by masters." },
  { title: "Delivery", step: "PHASE 4", desc: "Final testing and handover." }
]

export function AnimatedWorkflow() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const cards = gsap.utils.toArray('.workflow-card')
    
    gsap.from(cards, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="border-b-2 border-black relative z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-black opacity-[0.03] uppercase tracking-tighter whitespace-nowrap z-[-1] pointer-events-none text-black">
        WORKFLOW
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
        <div className="md:col-span-4 p-8 md:p-16 flex flex-col justify-between bg-[var(--color-primary)] text-white transition-transform duration-500 hover:scale-[1.03]">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mb-12">
            THE <br /> WORKFLOW
          </h2>
          <p className="text-lg font-medium opacity-90">
            A systematic approach to mechanical perfection. From consultation to final delivery, we leave nothing to chance.
          </p>
        </div>

        <div className="md:col-span-8 bg-[var(--color-grey-100)] p-4 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            {PHASES.map((item, index) => (
              <div 
                key={index} 
                className="workflow-card bg-white p-8 md:p-12 border-2 border-black flex flex-col justify-center transition-all duration-500 hover:scale-[1.03] hover:bg-black hover:text-white group cursor-pointer"
              >
                <div className="text-[var(--color-primary)] font-bold text-sm tracking-widest mb-4">
                  {item.step}
                </div>
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-black/70 group-hover:text-white/70 font-medium transition-colors">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
