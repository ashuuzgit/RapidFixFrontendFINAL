"use client"

import { useEffect, useState } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { MessageSquare, Car, Smartphone, Truck, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@antigravity/ui/Button"
import Link from "next/link"
import Image from "next/image"

export function ServiceFlow() {
  const [phase, setPhase] = useState<"idle" | "request" | "toast" | "dispatch" | "arrived">("idle")
  
  const path1Controls = useAnimation()
  const path2Controls = useAnimation()
  const icon1Controls = useAnimation()
  const icon2Controls = useAnimation()

  useEffect(() => {
    let isMounted = true

    const runSequence = async () => {
      while (isMounted) {
        // Reset states
        setPhase("idle")
        path1Controls.set({ pathLength: 0, opacity: 0 })
        path2Controls.set({ pathLength: 0, opacity: 0 })
        icon1Controls.set({ x: 150, y: 400, opacity: 0, scale: 0 })
        icon2Controls.set({ x: 550, y: 100, opacity: 0, scale: 0 })

        await new Promise(r => setTimeout(r, 1000))
        if (!isMounted) break

        // 1. Client sends request
        setPhase("request")
        path1Controls.set({ opacity: 1 })
        icon1Controls.set({ opacity: 1, scale: 1 })
        
        path1Controls.start({ pathLength: 1, transition: { duration: 2.5, ease: "linear" } })
        await icon1Controls.start({ 
          x: [150, 150, 200, 450], 
          y: [400, 150, 100, 100], 
          transition: { duration: 2.5, times: [0, 0.44, 0.56, 1], ease: "linear" } 
        })
        
        if (!isMounted) break
        
        // Hide message icon, show toast
        icon1Controls.start({ scale: 0, opacity: 0, transition: { duration: 0.2 } })
        setPhase("toast")
        await new Promise(r => setTimeout(r, 2000))
        
        if (!isMounted) break

        // 2. Dispatch car
        setPhase("dispatch")
        path2Controls.set({ opacity: 1 })
        icon2Controls.set({ opacity: 1, scale: 1 })
        
        path2Controls.start({ pathLength: 1, transition: { duration: 2.5, ease: "linear" } })
        await icon2Controls.start({ 
          x: [550, 800, 850, 850], 
          y: [100, 100, 150, 400], 
          transition: { duration: 2.5, times: [0, 0.44, 0.56, 1], ease: "linear" } 
        })
        
        if (!isMounted) break
        
        // Arrived
        setPhase("arrived")
        await new Promise(r => setTimeout(r, 3000))
      }
    }

    runSequence()

    return () => {
      isMounted = false
    }
  }, [path1Controls, path2Controls, icon1Controls, icon2Controls])

  return (
    <section className="border-b-2 border-black bg-white py-24 relative overflow-hidden flex flex-col items-center">
      <div className="container mx-auto px-4 max-w-6xl z-10">
        
        {/* Container for the SVG and animations */}
        <div className="relative w-full aspect-[1/1.5] md:aspect-[2/1]">
          
          {/* Responsive SVG wrapper */}
          <div className="absolute inset-0 w-full h-full hidden md:block">
            <svg viewBox="0 0 1000 500" className="w-full h-full preserve-3d">
              {/* Path 1 Base */}
              <path 
                d="M 150 400 L 150 150 Q 150 100 200 100 L 450 100" 
                fill="none" 
                stroke="#d1d5db" 
                strokeWidth="6" 
                strokeDasharray="12 12" 
              />
              {/* Path 1 Animated Fill (Red) */}
              <motion.path 
                d="M 150 400 L 150 150 Q 150 100 200 100 L 450 100" 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="6"
                strokeLinecap="round"
                animate={path1Controls}
              />
              
              {/* Path 2 Base */}
              <path 
                d="M 550 100 L 800 100 Q 850 100 850 150 L 850 400" 
                fill="none" 
                stroke="#d1d5db" 
                strokeWidth="6" 
                strokeDasharray="12 12" 
              />
              {/* Path 2 Animated Fill (Green) */}
              <motion.path 
                d="M 550 100 L 800 100 Q 850 100 850 150 L 850 400" 
                fill="none" 
                stroke="#22c55e" 
                strokeWidth="6"
                strokeLinecap="round"
                animate={path2Controls}
              />
            </svg>

            {/* Icons Moving Along Paths (SVG Coordinates mapped to standard CSS) */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <svg viewBox="0 0 1000 500" className="w-full h-full overflow-visible">
                <motion.g animate={icon1Controls} className="origin-center">
                  <circle cx="0" cy="0" r="24" fill="#ef4444" className="shadow-lg" />
                  <foreignObject x="-16" y="-16" width="32" height="32">
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <MessageSquare size={18} />
                    </div>
                  </foreignObject>
                </motion.g>

                <motion.g animate={icon2Controls} className="origin-center">
                  <circle cx="0" cy="0" r="24" fill="#22c55e" className="shadow-lg" />
                  <foreignObject x="-16" y="-16" width="32" height="32">
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <Car size={20} />
                    </div>
                  </foreignObject>
                </motion.g>
              </svg>
            </div>
          </div>

          {/* Desktop Layout Overlays */}
          <div className="absolute inset-0 w-full h-full hidden md:flex flex-col justify-between p-8 pointer-events-none">
            {/* Top Center: Rapid Fix */}
            <div className="absolute top-[20%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-24 h-24 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-md z-10 relative">
                <Image src="/logo.png" alt="RapidFix Logo" width={60} height={60} className="object-contain" />
                <AnimatePresence>
                  {phase === "toast" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: -40, scale: 1 }}
                      exit={{ opacity: 0, y: -50, scale: 0.9 }}
                      className="absolute -top-12 bg-black text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 whitespace-nowrap shadow-xl"
                    >
                      <CheckCircle2 size={16} className="text-green-400" /> BOOKING DONE!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Left: Client Request */}
            <div className="absolute top-[80%] left-[15%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-20 h-24 bg-white border-2 border-black rounded-xl flex flex-col items-center justify-center shadow-md mb-4 relative z-10">
                <div className="w-10 h-2 bg-gray-200 rounded-full mb-2"></div>
                <Smartphone size={32} className="text-red-500 mb-1" />
                <div className="w-12 h-1 bg-gray-200 rounded-full mt-1"></div>
              </div>
              <div className="font-black tracking-widest text-sm uppercase flex items-center gap-2">
                <span className="text-red-500 italic"></span> CLIENT REQUEST <span className="text-red-500 italic"></span>
              </div>
            </div>

            {/* Bottom Right: Home Pickup */}
            <div className="absolute top-[80%] left-[85%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-24 h-20 bg-white border-2 border-black rounded-xl flex items-center justify-center shadow-md mb-4 relative z-10">
                <Truck size={40} className="text-green-500" />
                <AnimatePresence>
                  {phase === "arrived" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: -40, scale: 1 }}
                      exit={{ opacity: 0, y: -50, scale: 0.9 }}
                      className="absolute -top-12 bg-black text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 whitespace-nowrap shadow-xl"
                    >
                      <CheckCircle2 size={16} className="text-green-400" /> HELP ARRIVED!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="font-black tracking-widest text-sm uppercase flex items-center gap-2">
                <span className="text-green-500 italic"></span> HOME PICKUP <span className="text-green-500 italic"></span>
              </div>
            </div>

            {/* Center Content */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl text-center flex flex-col items-center pointer-events-auto mt-8">
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-4">
                Neglecting car issues is costing you time and expensive repairs.
              </h2>
              <p className="text-black/70 font-medium mb-4">
                Every warning light and strange noise you ignore leads to a more costly future.
              </p>
              <p className="text-black/70 font-medium mb-8">
                RapidFix provides swift, reliable service so you can drive with confidence.
              </p>
              <Link href="/booking">
                <Button size="lg" className="w-full sm:w-auto px-16 group text-xl h-20">
                  SCHEDULE HOME PICKUP <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Layout (Stacked) */}
          <div className="flex md:hidden flex-col items-center text-center p-8 h-full justify-center">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-20 bg-white border-2 border-black rounded-xl flex flex-col items-center justify-center shadow-md">
                  <Smartphone size={24} className="text-red-500" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <motion.div 
                    animate={{ y: [0, 10, 0] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 mb-1"></div>
                    <div className="w-2 h-2 rounded-full bg-red-500 mb-1"></div>
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  </motion.div>
                </div>
                <div className="w-20 h-20 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-md relative">
                  <Image src="/logo.png" alt="RapidFix Logo" width={40} height={40} className="object-contain" />
                  <AnimatePresence>
                    {phase === "toast" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: -30, scale: 1 }}
                        exit={{ opacity: 0, y: -40, scale: 0.9 }}
                        className="absolute -top-10 bg-black text-white px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1 whitespace-nowrap"
                      >
                        <CheckCircle2 size={12} className="text-green-400" /> DONE!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <motion.div 
                    animate={{ y: [0, 10, 0] }} 
                    transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 mb-1"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500 mb-1"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </motion.div>
                </div>
                <div className="w-16 h-16 bg-white border-2 border-black rounded-xl flex items-center justify-center shadow-md relative">
                  <Truck size={24} className="text-green-500" />
                  <AnimatePresence>
                    {phase === "arrived" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: -30, scale: 1 }}
                        exit={{ opacity: 0, y: -40, scale: 0.9 }}
                        className="absolute -top-10 bg-black text-white px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1 whitespace-nowrap"
                      >
                        <CheckCircle2 size={12} className="text-green-400" /> ARRIVED!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
             </div>

             <h2 className="text-2xl font-black tracking-tight mb-4">
                Neglecting car issues is costing you time and expensive repairs.
             </h2>
             <p className="text-black/70 font-medium mb-4 text-sm">
                Every warning light and strange noise you ignore leads to a more costly future. RapidFix provides swift, reliable service so you can drive with confidence.
             </p>
             <Link href="/booking" className="w-full mt-4 flex justify-center">
               <Button size="lg" className="w-full group text-sm sm:text-base md:text-xl h-auto py-4 px-2 whitespace-normal flex items-center justify-center text-center leading-tight max-w-[90vw]">
                 SCHEDULE HOME PICKUP <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform shrink-0" />
               </Button>
             </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
