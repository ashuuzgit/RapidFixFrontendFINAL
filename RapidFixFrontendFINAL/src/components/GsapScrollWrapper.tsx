"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function GsapScrollWrapper({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!mainRef.current) return;

    // Select all major sections to animate
    const sections = mainRef.current.querySelectorAll("section:not(.no-gsap)");

    sections.forEach((section) => {
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%", // Starts animation when the top of the section hits 85% of the viewport height
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, { scope: mainRef });

  return <div ref={mainRef} className="w-full min-h-screen overflow-x-hidden">{children}</div>;
}
