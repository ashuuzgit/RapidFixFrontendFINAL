"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RecommendationStrip() {
  const items = [
    { text: '"Great and timely Service"', rating: 5 },
    { text: '"Complete game-changer for me "', rating: 5 },
    { text: '"Now I\'m tension-free"', rating: 5 },
    { text: '"Incredible service, highly recommended"', rating: 5 },
    { text: '"Best decision we made this year"', rating: 5 },
  ];

  return (
    <div className="w-full bg-white overflow-hidden py-12 md:py-20 relative z-20 flex items-center justify-center">
      {/* The rotated container */}
      <div 
        className="w-[110%] absolute left-1/2 -translate-x-1/2 bg-[#96250C] transform -rotate-2 py-4 shadow-xl flex z-10"
      >
        <div className="flex animate-marquee whitespace-nowrap">
          {/* Double the items for seamless loop */}
          {[...items, ...items, ...items].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 mx-8 text-white">
              <span className="font-semibold text-lg md:text-xl tracking-wide">{item.text}</span>
              <div className="flex gap-1">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="size-5 fill-white text-white" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
