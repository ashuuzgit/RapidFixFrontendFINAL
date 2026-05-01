export function StatisticsStrip() {
  return (
    <section className="bg-[var(--color-grey-100)] border-b-2 border-black py-16 md:py-24 relative z-10">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-black/10">
          
          <div className="flex flex-col items-center justify-center text-center px-4">
            <h3 className="text-5xl md:text-6xl font-black mb-2 tracking-tighter">10,000+</h3>
            <p className="text-xs md:text-sm font-bold tracking-widest text-black/60 uppercase">CARS SERVICED</p>
          </div>

          <div className="flex flex-col items-center justify-center text-center px-4 pt-12 sm:pt-0">
            <h3 className="text-5xl md:text-6xl font-black mb-2 tracking-tighter">98%</h3>
            <p className="text-xs md:text-sm font-bold tracking-widest text-black/60 uppercase">SATISFACTION RATE</p>
          </div>

          <div className="flex flex-col items-center justify-center text-center px-4 pt-12 lg:pt-0">
            <h3 className="text-5xl md:text-6xl font-black mb-2 tracking-tighter">15</h3>
            <p className="text-xs md:text-sm font-bold tracking-widest text-black/60 uppercase">EXPERT MECHANICS</p>
          </div>

          <div className="flex flex-col items-center justify-center text-center px-4 pt-12 lg:pt-0">
            <h3 className="text-5xl md:text-6xl font-black mb-2 tracking-tighter">Same-Day</h3>
            <p className="text-xs md:text-sm font-bold tracking-widest text-black/60 uppercase">SERVICE AVAILABLE</p>
          </div>

        </div>
      </div>
    </section>
  );
}
