"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "What services does RapidFix provide for cars and bikes?",
    a: "RapidFix offers professional car and bike repair services including periodic maintenance, engine diagnostics, brake repair, AC servicing, battery replacement, tyre services, denting & painting, and emergency roadside assistance. Our workshop ensures reliable and affordable vehicle servicing.",
  },
  {
    q: "How can I book a car or bike service with RapidFix online?",
    a: "You can easily book a car service or bike repair online through our website. Select your required service, choose a convenient time slot, and confirm your booking in just a few clicks.",
  },
  {
    q: "Does RapidFix offer doorstep car and bike service?",
    a: "Yes, RapidFix provides doorstep vehicle servicing in selected locations. Our expert technicians come to your home or office, making it easier to get your car or bike serviced without visiting a workshop.",
  },
  {
    q: "Is RapidFix available in my city?",
    a: "RapidFix is expanding rapidly across multiple cities in India. To check availability, enter your location on our website and find car service near you instantly.",
  },
  {
    q: "Which car and bike brands does RapidFix service?",
    a: "RapidFix services all major brands including Tata, Mahindra, Honda, Hyundai, Suzuki, BMW, Audi, Mercedes, and more. We provide multi-brand vehicle servicing with genuine parts and expert care.",
  },
  {
    q: "Do you provide warranty on repairs and services?",
    a: "Yes, we offer a service warranty on car and bike repairs. Warranty coverage depends on the type of service and parts used, ensuring peace of mind and quality assurance.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-black text-white py-24 relative z-10 border-b-2 border-white/10">
      {/* JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What services does RapidFix provide for cars and bikes?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "RapidFix offers car and bike repair services including maintenance, engine diagnostics, AC servicing, battery replacement, tyre services, denting and painting, and roadside assistance.",
                },
              },
              {
                "@type": "Question",
                name: "Does RapidFix offer doorstep car service?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, RapidFix provides doorstep vehicle servicing where technicians visit your home or office.",
                },
              },
              {
                "@type": "Question",
                name: "How can I book a service with RapidFix?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "You can book a service online through the RapidFix website by selecting your service and time slot.",
                },
              },
            ],
          }),
        }}
      />

      <div className="container mx-auto px-8 max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-16 text-center">
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <div className="flex flex-col">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border-b border-white/10 last:border-b-0 py-6"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between text-left group outline-none"
              >
                <h3 className="text-lg md:text-xl font-bold uppercase tracking-wide group-hover:text-white/80 transition-colors">
                  {faq.q}
                </h3>
                <div className="text-[#ff2020] shrink-0 ml-6">
                  {openIndex === index ? (
                    <Minus className="w-6 h-6" />
                  ) : (
                    <Plus className="w-6 h-6" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-white/60 pt-4 leading-relaxed font-medium pr-12">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
