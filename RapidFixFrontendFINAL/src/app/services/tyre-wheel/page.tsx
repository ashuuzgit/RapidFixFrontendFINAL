import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@antigravity/ui/Button";
import { ArrowRight, ShieldCheck, Clock, Banknote } from "lucide-react";
import { BrandsStrip } from "@/components/BrandsStrip";
import { StatisticsStrip } from "@/components/StatisticsStrip";

export const metadata: Metadata = {
  title: "Tyre & Wheel | Doorstep Service | RapidFix",
  description: "Book expert tyre & wheel with RapidFix. We provide the best car repair near me, bike repair near me, and automotive repair in Delhi NCR.",
  keywords: ["car service near me","bike service near me","car repair near me","bike repair near me","car wash near me","bike wash near me","engine repair near me","car AC repair near me","battery replacement near me","tyre and wheel near me","denting and painting near me","EV service near me","puncture repair near me","rapidfix","rapidfixauto","automotive repair Delhi","mechanic near me"],
  alternates: { canonical: "https://rapidfixauto.in/services/tyre-wheel" },
};

export default function tyrewheelPage() {
  return (
    <div className="w-full flex flex-col bg-white overflow-hidden relative pt-24">
      <main className="container mx-auto px-8 py-16 max-w-5xl">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-none mb-6 text-black">
          Tyre & Wheel
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          <div>
            <h2 className="text-2xl font-bold uppercase mb-4">Precision & Performance</h2>
            <p className="text-lg text-black/70 font-medium mb-6">
              When searching for <strong>tyre and wheel near me</strong>, RapidFix is your ultimate destination for professional auto care. From comprehensive <strong>car wash near me</strong> and <strong>bike wash near me</strong> services to advanced <strong>engine repair near me</strong>, we deliver dealership-quality maintenance right to your doorstep.
            </p>
            <p className="text-lg text-black/70 font-medium">
              We cover all your needs including <strong>battery replacement near me</strong>, <strong>tyre and wheel near me</strong>, <strong>puncture repair near me</strong>, and seamless <strong>denting and painting near me</strong>. If you are looking for <strong>automotive repair Delhi</strong> or the most trusted <strong>mechanic near me</strong>, RapidFixAuto ensures peak performance and safety.
            </p>
          </div>
          <div className="bg-[var(--color-grey-100)] p-8 border-2 border-black flex flex-col justify-center relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8vw] font-black opacity-[0.03] uppercase tracking-tighter whitespace-nowrap z-0 pointer-events-none text-black">
              RAPIDFIX
            </div>
            <h3 className="text-xl font-bold uppercase mb-4 z-10 relative">Transparent Pricing</h3>
            <ul className="space-y-3 font-medium text-black/70 z-10 relative">
              <li className="flex justify-between border-b border-black/10 pb-2"><span>Standard Checkup</span> <span>₹299</span></li>
              <li className="flex justify-between border-b border-black/10 pb-2"><span>Comprehensive Care</span> <span>₹899</span></li>
              <li className="flex justify-between pb-2"><span>Premium Service</span> <span>₹1499</span></li>
            </ul>
          </div>
        </div>
      </main>


      <section className="border-t-2 border-b-2 border-black bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
          <div className="p-8 flex items-center justify-center gap-6 hover:bg-[var(--color-grey-100)] transition-colors group cursor-pointer">
            <ShieldCheck className="w-8 h-8 text-black group-hover:scale-110 transition-transform" />
            <div>
              <h4 className="font-black text-sm md:text-base tracking-widest uppercase">
                30 Days Warranty
              </h4>
              <p className="text-xs text-black/50 tracking-wider font-bold">
                TECHNICAL GUARANTEE
              </p>
            </div>
          </div>
          <div className="p-8 flex items-center justify-center gap-6 hover:bg-[var(--color-grey-100)] transition-colors group cursor-pointer">
            <Clock className="w-8 h-8 text-black group-hover:scale-110 transition-transform" />
            <div>
              <h4 className="font-black text-sm md:text-base tracking-widest uppercase">
                Same Day Delivery
              </h4>
              <p className="text-xs text-black/50 tracking-wider font-bold">
                TIME OPTIMIZATION
              </p>
            </div>
          </div>
          <div className="p-8 flex items-center justify-center gap-6 hover:bg-[var(--color-grey-100)] transition-colors group cursor-pointer">
            <Banknote className="w-8 h-8 text-black group-hover:scale-110 transition-transform" />
            <div>
              <h4 className="font-black text-sm md:text-base tracking-widest uppercase">
                Transparent Pricing
              </h4>
              <p className="text-xs text-black/50 tracking-wider font-bold">
                NO HIDDEN CHARGES
              </p>
            </div>
          </div>
        </div>
      </section>

      <BrandsStrip />
      <StatisticsStrip />

      <section className="border-b-2 border-black bg-[var(--color-grey-100)] py-24 relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-black opacity-[0.03] uppercase tracking-tighter whitespace-nowrap z-[-1] pointer-events-none text-black">
          ACTION
        </div>
        <div className="container mx-auto px-8 text-center flex flex-col items-center">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-8">
            WANT A SERVICE?
          </h2>
          <p className="text-xl text-black/70 font-medium mb-12 max-w-2xl">
            Don't let your vehicle settle for less. Book an appointment today
            and experience true automotive perfection.
          </p>
          <Link href="/booking">
            <Button
              size="lg"
              className="w-full sm:w-auto px-16 group text-xl h-20"
            >
              BOOK NOW{" "}
              <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
