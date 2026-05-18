import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@antigravity/ui/Button";
import { ArrowRight, ShieldCheck, Clock, Banknote } from "lucide-react";
import { BrandsStrip } from "@/components/BrandsStrip";
import { StatisticsStrip } from "@/components/StatisticsStrip";
import { formatCity } from "@/lib/utils";

type Props = { params: { city: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = formatCity(params?.city || "your-city");
  return {
    title: `Bike Service in ${city} | RapidFix`,
    description: `Book doorstep bike service in ${city} with RapidFix. We provide the best bike repair near me.`,
    keywords: ["car service near me","bike service near me","car repair near me","bike repair near me","car wash near me","bike wash near me","engine repair near me","car AC repair near me","battery replacement near me","tyre and wheel near me","denting and painting near me","EV service near me","puncture repair near me","rapidfix","rapidfixauto","automotive repair Delhi","mechanic near me"],
    alternates: { canonical: `https://rapidfixauto.in/bike-service-in-${params?.city}` },
  };
}

export default function BikeServiceInCityPage({ params }: Props) {
  const cityName = formatCity(params?.city || "your-city");

  return (
    <div className="w-full flex flex-col bg-white overflow-hidden relative pt-24">
      <main className="container mx-auto px-8 py-16 max-w-5xl">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-none mb-6">
          Bike Service in {cityName}
        </h1>
        <div className="mt-8 mb-12 text-lg text-black/70 font-medium space-y-6">
          <p>
            Looking for a dependable <strong>bike service near me</strong> or <strong>bike repair near me</strong> in {cityName}? RapidFix delivers expert two-wheeler maintenance directly to you.
          </p>
          <p>
            From routine maintenance and <strong>bike wash near me</strong> to complex <strong>engine repair near me</strong> and <strong>battery replacement near me</strong>, our RapidFixAuto mechanics ensure your bike stays in peak condition.
          </p>
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
