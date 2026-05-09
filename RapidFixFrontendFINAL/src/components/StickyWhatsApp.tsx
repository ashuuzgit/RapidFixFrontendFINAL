"use client"

import { useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"

export function StickyWhatsApp() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const contactSection = document.getElementById("contact")
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect()
        // If the top of the contact section is above the bottom of the viewport,
        // it means we have reached the contact section.
        if (rect.top <= window.innerHeight) {
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    // Initial check
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <a
      href="https://wa.me/919667891434"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={32} />
    </a>
  )
}
