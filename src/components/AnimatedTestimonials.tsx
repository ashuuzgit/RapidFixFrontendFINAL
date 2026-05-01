"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote: "RapidFix represents a paradigm shift in automotive care. Their laboratory environment and computational rigor ensure unmatched mechanical integrity.",
    name: "RAJESH SHARMA",
    title: "CEO, SHARMA LOGISTICS",
  },
  {
    quote: "The engine tuning they did on my Honda was absolutely flawless. True professionals who understand performance.",
    name: "ANANYA PATEL",
    title: "AUTOMOTIVE ENTHUSIAST",
  },
  {
    quote: "I was stranded on the highway and their doorstep service was incredibly fast. Highly reliable.",
    name: "VIKRAM SINGH",
    title: "BUSINESS OWNER",
  },
  {
    quote: "Their transparency with pricing and the quality of parts used is unmatched. I won't go anywhere else.",
    name: "PRIYA DESAI",
    title: "MARKETING DIRECTOR",
  },
  {
    quote: "Got my suspension fixed here. The car feels brand new. Excellent attention to detail.",
    name: "ROHAN GUPTA",
    title: "SOFTWARE ENGINEER",
  },
  {
    quote: "The best car detailing service I have ever experienced. They treat your vehicle like their own.",
    name: "SNEHA REDDY",
    title: "ARCHITECT",
  },
  {
    quote: "Honest mechanics are hard to find. RapidFix tells you exactly what needs to be fixed and nothing more.",
    name: "AMIT KUMAR",
    title: "BANK MANAGER",
  },
  {
    quote: "The 30-day warranty gave me peace of mind. Exceptional service and great staff.",
    name: "NEHA IYER",
    title: "DOCTOR",
  },
  {
    quote: "I've been a loyal customer for 2 years. They always deliver on time and their work is top-notch.",
    name: "KARTIK MENON",
    title: "ENTREPRENEUR",
  },
  {
    quote: "The app makes booking so easy. The mechanic arrived within 30 mins just as promised.",
    name: "POOJA JOSHI",
    title: "TEACHER",
  },
  {
    quote: "They managed to fix an electrical issue in my VW that two other garages couldn't figure out.",
    name: "ARJUN CHATTERJEE",
    title: "CONSULTANT",
  },
  {
    quote: "The premium service you get here is totally worth the price. Highly recommended for luxury cars.",
    name: "MEERA NAIR",
    title: "FASHION DESIGNER",
  },
  {
    quote: "Fast, efficient, and professional. They replaced my brake pads in record time.",
    name: "SANJAY VERMA",
    title: "SALES MANAGER",
  },
  {
    quote: "I love that they explain the technical details so clearly. Really built trust with me.",
    name: "DIVYA RAO",
    title: "DATA SCIENTIST",
  },
  {
    quote: "Their doorstep car wash and polish service is a lifesaver for my busy schedule.",
    name: "ADITYA MALHOTRA",
    title: "FREELANCER",
  },
  {
    quote: "From booking to delivery, the whole process was seamless. Great customer support.",
    name: "KAVITA CHOUDHARY",
    title: "HR EXECUTIVE",
  },
  {
    quote: "They restored my vintage Jawa beautifully. True craftsmanship and passion for automobiles.",
    name: "MOHIT AGARWAL",
    title: "RESTAURATEUR",
  },
  {
    quote: "The AC service was quick and effective. The cooling is better than when I first bought the car.",
    name: "SHRUTI BHATIA",
    title: "STUDENT",
  },
  {
    quote: "I appreciate the detailed inspection report they provide before starting any work.",
    name: "NAVIN PILLAI",
    title: "ENGINEER",
  },
  {
    quote: "Hands down the most reliable garage in the city. Five stars all the way.",
    name: "RITU KAPOOR",
    title: "EVENT PLANNER",
  },
];

gsap.registerPlugin(ScrollTrigger);

export function AnimatedTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLElement>(null);
  const leftBoxRef = useRef<HTMLDivElement>(null);
  const rightBoxRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleSpanRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleRightBoxEnter = () => {
    gsap.to(leftBoxRef.current, { width: "40%", backgroundColor: "#ffffff", color: "#000000", duration: 0.8, ease: "power3.out" });
    gsap.to(rightBoxRef.current, { width: "60%", backgroundColor: "var(--color-grey-100)", color: "#000000", duration: 0.8, ease: "power3.out" });
    gsap.to(titleRef.current, { color: "#000000", duration: 0.8, ease: "power3.out" });
    gsap.to(titleSpanRef.current, { color: "rgba(0,0,0,0.2)", duration: 0.8, ease: "power3.out" });
    gsap.to(subtitleRef.current, { color: "var(--color-primary)", duration: 0.8, ease: "power3.out" });
  };

  const handleLeftBoxEnter = () => {
    gsap.to(leftBoxRef.current, { width: "60%", backgroundColor: "#000000", color: "#ffffff", duration: 0.8, ease: "power3.out" });
    gsap.to(rightBoxRef.current, { width: "40%", backgroundColor: "#ffffff", color: "#000000", duration: 0.8, ease: "power3.out" });
    gsap.to(titleRef.current, { color: "#ffffff", duration: 0.8, ease: "power3.out" });
    gsap.to(titleSpanRef.current, { color: "rgba(255,255,255,0.2)", duration: 0.8, ease: "power3.out" });
    gsap.to(subtitleRef.current, { color: "var(--color-primary)", duration: 0.8, ease: "power3.out" });
  };

  const handleMouseLeave = () => {
    handleLeftBoxEnter(); // Revert to default
  };

  const currentT = testimonials[currentIndex];

  return (
    <section 
      ref={containerRef}
      className="border-b-2 border-black bg-white relative z-10 overflow-hidden flex flex-col lg:flex-row min-h-[600px]"
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute -bottom-10 right-0 text-[15vw] font-black opacity-[0.03] uppercase tracking-tighter whitespace-nowrap z-[-1] pointer-events-none text-black">
        TRUST
      </div>
      
      {/* Left Box */}
      <div 
        ref={leftBoxRef}
        onMouseEnter={handleLeftBoxEnter}
        className="p-12 md:p-24 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-black w-full lg:w-[60%] bg-black text-white will-change-[width,background-color]"
      >
        <div>
          <p ref={subtitleRef} className="text-[var(--color-primary)] font-black tracking-widest text-xs uppercase mb-8">
            INTELLIGENCE REPORT
          </p>
          <h2 ref={titleRef} className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-none text-white">
            THE VOICE OF <br />
            <span ref={titleSpanRef} className="text-white/20">PRECISION</span>
          </h2>
        </div>
        <div className="flex gap-4 mt-16">
          <button 
            onClick={prevTestimonial}
            className="w-14 h-14 border border-current/20 flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-all hover:scale-110"
          >
            <ArrowLeft size={24} />
          </button>
          <button 
            onClick={nextTestimonial}
            className="w-14 h-14 bg-[var(--color-primary)] text-white flex items-center justify-center hover:bg-[#96250C] transition-all hover:scale-110"
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* Right Box */}
      <div 
        ref={rightBoxRef}
        onMouseEnter={handleRightBoxEnter}
        className="p-12 md:p-24 flex flex-col justify-center w-full lg:w-[40%] bg-white text-black will-change-[width,background-color]"
      >
        <div className="min-h-[200px]">
          <p className="text-2xl md:text-4xl font-bold leading-tight mb-12 tracking-tight">
            "{currentT.quote}"
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-black flex items-center justify-center text-white/50 rounded-full shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div>
            <h4 className="font-black text-sm tracking-widest uppercase">{currentT.name}</h4>
            <p className="text-xs text-black/50 tracking-wider font-bold mt-1">{currentT.title}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
