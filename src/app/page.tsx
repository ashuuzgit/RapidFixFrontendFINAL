import { Button } from "@antigravity/ui/Button"
import { ArrowRight, ArrowLeft, ShieldCheck, Clock, Banknote } from "lucide-react"
import Link from "next/link"
import { HeroSlideshow } from "@/components/HeroSlideshow"
import { AnimatedServices } from "@/components/AnimatedServices"
import { AnimatedWorkflow } from "@/components/AnimatedWorkflow"
import { RecommendationStrip } from "@/components/RecommendationStrip"
import { BrandsStrip } from "@/components/BrandsStrip"
import { AnimatedTestimonials } from "@/components/AnimatedTestimonials"
import { StatisticsStrip } from "@/components/StatisticsStrip"
import { ServiceFlow } from "@/components/ServiceFlow"

export default function Home() {
  return (
    <div className="w-full flex flex-col bg-white overflow-hidden relative">
      {/* Hero Section */}
      <HeroSlideshow />

      {/* Guarantees Bar (Image 2) */}
      <section className="border-b-2 border-black bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
          <div className="p-8 flex items-center justify-center gap-6 hover:bg-[var(--color-grey-100)] transition-colors group cursor-pointer">
            <ShieldCheck className="w-8 h-8 text-black group-hover:scale-110 transition-transform" />
            <div>
              <h4 className="font-black text-sm md:text-base tracking-widest uppercase">30 Days Warranty</h4>
              <p className="text-xs text-black/50 tracking-wider font-bold">TECHNICAL GUARANTEE</p>
            </div>
          </div>
          <div className="p-8 flex items-center justify-center gap-6 hover:bg-[var(--color-grey-100)] transition-colors group cursor-pointer">
            <Clock className="w-8 h-8 text-black group-hover:scale-110 transition-transform" />
            <div>
              <h4 className="font-black text-sm md:text-base tracking-widest uppercase">Same Day Delivery</h4>
              <p className="text-xs text-black/50 tracking-wider font-bold">TIME OPTIMIZATION</p>
            </div>
          </div>
          <div className="p-8 flex items-center justify-center gap-6 hover:bg-[var(--color-grey-100)] transition-colors group cursor-pointer">
            <Banknote className="w-8 h-8 text-black group-hover:scale-110 transition-transform" />
            <div>
              <h4 className="font-black text-sm md:text-base tracking-widest uppercase">Fixed Rates</h4>
              <p className="text-xs text-black/50 tracking-wider font-bold">FROM $699 INCLUSIVE</p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro & Core Statement */}
      <section className="border-b-2 border-black relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] font-black opacity-5 uppercase tracking-tighter whitespace-nowrap z-[-1] pointer-events-none">
          PERFORMANCE
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
          <div className="p-8 md:p-16 lg:p-24 flex flex-col justify-center bg-[var(--color-grey-100)]/80 backdrop-blur-sm">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none mb-6">
              THE <br /> ANTIGRAVITY <br /> DIFFERENCE
            </h2>
            <p className="text-xl text-black/70 max-w-md font-medium">
              We don't just fix cars. We elevate them. Our engineering approach ensures maximum performance and reliability.
            </p>
          </div>
          <div className="p-8 md:p-16 lg:p-24 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <Link href="/booking" className="w-full">
              <Button size="lg" className="w-full group">
                BOOK A SERVICE <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* The Workflow (GSAP Animated) */}
      <AnimatedWorkflow />

      {/* Services Section (GSAP Animated) */}
      <AnimatedServices />

      {/* Recommendation Strip (Image 2) */}
      <RecommendationStrip />

      {/* Brands We Serve (Image 3) */}
      <BrandsStrip />

      {/* Testimonials Section (Animated) */}
      <AnimatedTestimonials />

      {/* Service Flow Section */}
      <ServiceFlow />

      {/* Statistics Section */}
      <StatisticsStrip />

      {/* CTA Section */}
      <section className="border-b-2 border-black bg-[var(--color-grey-100)] py-24 relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-black opacity-[0.03] uppercase tracking-tighter whitespace-nowrap z-[-1] pointer-events-none text-black">
          ACTION
        </div>
        <div className="container mx-auto px-8 text-center flex flex-col items-center">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-8">
            WANT A SERVICE?
          </h2>
          <p className="text-xl text-black/70 font-medium mb-12 max-w-2xl">
            Don't let your vehicle settle for less. Book an appointment today and experience true automotive perfection.
          </p>
          <Link href="/booking">
            <Button size="lg" className="w-full sm:w-auto px-16 group text-xl h-20">
              BOOK NOW <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  )
}
