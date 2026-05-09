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
  const progressBarRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    let mm = gsap.matchMedia();
    const checkpoints = gsap.utils.toArray('.checkpoint-marker') as HTMLElement[];

    mm.add("(min-width: 768px)", () => {
      // Desktop: Horizontal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom 60%",
          scrub: 1,
          onUpdate: () => {
            if (!progressBarRef.current) return;
            const progressRect = progressBarRef.current.getBoundingClientRect();
            checkpoints.forEach((cp) => {
              const cpRect = cp.getBoundingClientRect();
              if (progressRect.right >= cpRect.left + cpRect.width / 2) {
                gsap.to(cp, { backgroundColor: "var(--color-primary)", borderColor: "var(--color-primary)", duration: 0.1, overwrite: "auto" });
                gsap.to(cp.querySelector('.check-icon'), { opacity: 1, duration: 0.1, overwrite: "auto" });
              } else {
                gsap.to(cp, { backgroundColor: "white", borderColor: "#d1d5db", duration: 0.1, overwrite: "auto" });
                gsap.to(cp.querySelector('.check-icon'), { opacity: 0, duration: 0.1, overwrite: "auto" });
              }
            });
          }
        }
      });
      
      tl.to(progressBarRef.current, { width: "100%", ease: "none" }, 0)
        .to(logoRef.current, { left: "100%", ease: "none" }, 0);
    });

    mm.add("(max-width: 767px)", () => {
      // Mobile: Vertical
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom 60%",
          scrub: 1,
          onUpdate: () => {
            if (!progressBarRef.current) return;
            const progressRect = progressBarRef.current.getBoundingClientRect();
            checkpoints.forEach((cp) => {
              const cpRect = cp.getBoundingClientRect();
              if (progressRect.bottom >= cpRect.top + cpRect.height / 2) {
                gsap.to(cp, { backgroundColor: "var(--color-primary)", borderColor: "var(--color-primary)", duration: 0.1, overwrite: "auto" });
                gsap.to(cp.querySelector('.check-icon'), { opacity: 1, duration: 0.1, overwrite: "auto" });
              } else {
                gsap.to(cp, { backgroundColor: "white", borderColor: "#d1d5db", duration: 0.1, overwrite: "auto" });
                gsap.to(cp.querySelector('.check-icon'), { opacity: 0, duration: 0.1, overwrite: "auto" });
              }
            });
          }
        }
      });
      
      tl.to(progressBarRef.current, { height: "100%", ease: "none" }, 0)
        .to(logoRef.current, { top: "100%", ease: "none" }, 0);
    });

    return () => mm.revert();
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="border-b-2 border-black relative z-10 bg-[var(--color-grey-100)] py-16 md:py-24 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-black opacity-[0.03] uppercase tracking-tighter whitespace-nowrap z-0 pointer-events-none text-black">
        WORKFLOW
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16 md:mb-24 p-8 md:p-12 bg-[var(--color-primary)] text-white shadow-xl w-full">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none text-white shrink-0">
            THE <br className="hidden md:block" /> WORKFLOW
          </h2>
          <p className="text-lg md:text-xl font-medium text-white/90 max-w-xl md:text-right">
            A systematic approach to mechanical perfection. From consultation to final delivery, we leave nothing to chance.
          </p>
        </div>

        {/* Progress Bar & Cards Container */}
        <div className="relative pt-8 md:pt-16 pb-8 md:pb-0">
          
          {/* Tracking line wrapper */}
          <div ref={trackRef} className="absolute left-[39px] md:left-0 top-0 md:top-0 w-1 md:w-full h-full md:h-1 z-0">
            {/* Background Track */}
            <div className="absolute top-0 left-0 w-full h-full bg-gray-300" />
            
            {/* Fill Bar */}
            <div 
              ref={progressBarRef} 
              className="absolute top-0 left-0 bg-[var(--color-primary)] w-full h-0 md:w-0 md:h-full" 
            />
            
            {/* Traveling Logo */}
            <div
              ref={logoRef}
              className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-30 bg-white rounded-full p-2 border-2 border-[var(--color-primary)] flex items-center justify-center w-16 h-16 md:w-20 md:h-20 shadow-lg"
            >
              <img 
                src="/NewLogoSvg.svg" 
                alt="Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 pl-24 md:pl-0 mt-8 md:mt-12 relative z-10">
            {PHASES.map((item, index) => (
              <div key={index} className="relative h-full">
                {/* Checkpoint Marker */}
                <div className="checkpoint-marker absolute left-[-55px] top-1/2 md:left-1/2 md:top-[-46px] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-[3px] border-gray-300 flex items-center justify-center z-20">
                  <svg className="check-icon w-5 h-5 text-white opacity-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                
                {/* Card */}
                <div className="bg-white p-6 md:p-8 border-2 border-black flex flex-col justify-center transition-colors duration-300 hover:bg-black hover:text-white group min-h-[200px] h-full">
                  <div className="text-[var(--color-primary)] font-bold text-sm tracking-widest mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2 group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-black/70 group-hover:text-white/70 font-medium transition-colors text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
