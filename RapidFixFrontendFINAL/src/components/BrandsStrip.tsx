"use client";

import { useEffect, useRef, useState } from "react";

export function BrandsStrip() {
  // Using standard <img> to bypass Next.js image optimization issues with SVGs.
  const brands = [
    { name: "Tata", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg" },
    { name: "Mahindra", logo: "/brandLogos/mahindra.webp" },
    { name: "Hero", logo: "/brandLogos/hero.webp" },
    { name: "Honda", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda_Logo.svg" },
    { name: "Suzuki", logo: "/brandLogos/suzuki.webp" },
    { name: "Hyundai", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg" },
    { name: "Jawa", logo: "/brandLogos/java.webp" },
    { name: "Harley Davidson", logo: "/brandLogos/davidson.webp" },
    { name: "Volkswagen", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Volkswagen_Logo_till_1995.svg" },
    { name: "Audi", logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg" },
    { name: "BMW", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f4/BMW_logo_%28gray%29.svg" },
    { name: "TVS", logo: "/brandLogos/tvs.webp" },
    { name: "Ola", logo: "/brandLogos/ola.webp"},
    { name: "Skoda", logo: "/brandLogos/skoda.webp" },
    { name: "KIA", logo: "/brandLogos/kia.webp"},
    { name: "Mercedes", logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg" },
    { name: "Bajaj", logo: "/brandLogos/bajaj.webp"}
    
    ];

  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    // Create an intersection observer that only triggers when an item is strictly in the very center.
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting) {
            setActiveIndex(index);
          }
        });
      },
      {
        root: null, // viewport
        rootMargin: "0px -49% 0px -49%", // Extremely narrow center slice
        threshold: 0,
      }
    );

    const elements = containerRef.current?.querySelectorAll(".brand-logo");
    elements?.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  // Duplicate array multiple times to ensure enough items for the marquee
  const displayBrands = [...brands, ...brands, ...brands, ...brands];

  return (
    <section className="border-b-2 border-black bg-white overflow-hidden py-16 relative z-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black opacity-[0.03] uppercase tracking-tighter whitespace-nowrap z-[-1] pointer-events-none text-black">
        TOP BRANDS
      </div>
      <div className="text-center mb-10 relative z-10">
        <h2 className="text-3xl font-black uppercase tracking-tight">Brands We Serve</h2>
        <p className="text-muted-foreground mt-2 font-medium">Precision engineering for all major manufacturers.</p>
      </div>
      
      <div className="relative w-full flex">
        {/* Left and right fade gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <div className="flex animate-marquee-brands whitespace-nowrap items-center" ref={containerRef}>
          {displayBrands.map((brand, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div 
                key={idx} 
                data-index={idx}
                className="brand-logo flex items-center justify-center mx-12 md:mx-20 shrink-0 py-8"
              >
                <div 
                  className={`relative flex items-center justify-center transition-all duration-500 ease-in-out ${
                    isActive 
                      ? "scale-[1.5] grayscale-0 opacity-100 z-20" 
                      : "scale-100 grayscale opacity-40 hover:opacity-60 z-10"
                  }`}
                >
                  {/* Standard img tag handles SVGs better from external domains without next.config.js changes */}
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="object-contain w-48 h-24 md:w-56 md:h-28"
                    loading="lazy"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
