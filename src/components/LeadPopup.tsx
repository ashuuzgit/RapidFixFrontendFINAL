"use client"

import { useState, useEffect } from "react"
import { X, PhoneCall } from "lucide-react"
import Image from "next/image"
import { Button } from "@antigravity/ui/Button"

export function LeadPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")

  useEffect(() => {
    // Show popup after 3 seconds of page load
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
        
        {/* Close button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-10 size-8 flex items-center justify-center rounded-full bg-black text-white hover:scale-110 transition-transform shadow-md"
        >
          <X className="size-4" />
        </button>

        {/* Image Section */}
        <div className="relative h-64 md:h-auto md:w-5/12 bg-zinc-100 dark:bg-zinc-900">
          <Image 
            src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070&auto=format&fit=crop" 
            alt="Real-time doorstep repairs" 
            fill
            className="object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-10 md:w-7/12 flex flex-col justify-center relative">
          <div className="flex items-center gap-3 mb-4">
            <Image src="/logo.png" alt="RapidFix Logo" width={32} height={32} className="object-contain" />
            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">RAPID<span className="text-[#ff2020]">FIX</span></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-zinc-50">
            Real-time doorstep repairs
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-lg">
            Book a certified mechanic in <span className="font-semibold text-zinc-900 dark:text-zinc-100">30 seconds</span>. We come to you—home, office or roadside.
          </p>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); /* Handle submission */ setIsOpen(false); }}>
            <div className="flex relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-zinc-900 dark:text-zinc-100 pointer-events-none">
                +91
              </span>
              <input 
                type="tel" 
                placeholder="Phone Number" 
                className="w-full h-14 pl-14 pr-4 rounded-xl border-2 border-red-100 focus:border-red-500 outline-none transition-colors dark:bg-zinc-900 dark:border-red-900/30 dark:focus:border-red-500 text-lg text-black dark:text-white"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                pattern="[0-9]{10}"
              />
            </div>
            <Button type="submit" className="w-full h-14 text-lg font-bold bg-[#ff2020] hover:bg-[#e01010] text-white rounded-xl uppercase tracking-wider">
              Book Now
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">Or call us directly</p>
            <a href="tel:+919667891434" className="inline-flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-zinc-100 hover:text-red-500 transition-colors">
              <PhoneCall className="size-5" />
              +91 96678 91434
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
