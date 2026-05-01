import { Card, CardHeader, CardTitle, CardDescription } from "@antigravity/ui/Card"
import Image from "next/image"

export default function About() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] flex items-center justify-center bg-[var(--color-black)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/30 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
        
        <div className="container mx-auto px-8 relative z-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            PRECISION <span className="text-[var(--color-primary)]">REDEFINED.</span>
          </h1>
          <p className="text-lg text-[var(--color-grey-200)] max-w-2xl mx-auto">
            The story behind RapidFix and our relentless pursuit of mechanical perfection.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)] bg-white">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">BORN ON THE TRACK. <br/> BUILT FOR THE STREET.</h2>
              <p className="text-[var(--color-grey-800)] leading-relaxed">
                RapidFix was founded by a team of ex-motorsport engineers who grew tired of the industry standard. We didn't just want to repair cars; we wanted to optimize them. Every vehicle that enters our facility is treated with the same rigorous scrutiny as a race car preparing for Le Mans.
              </p>
              <p className="text-[var(--color-grey-800)] leading-relaxed">
                Our facility in California is equipped with surgical-grade tools and proprietary diagnostic software. We believe in transparency, precision, and performance above all else. When you leave your keys with us, you're not just a customer—you're a partner in engineering.
              </p>
            </div>
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1599256621730-535171e28e50?q=80&w=1000&auto=format&fit=crop" 
                alt="Mechanic working on an engine"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Architecture / Milestones */}
      <section className="py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)] bg-[var(--color-grey-100)]">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">THE ARCHITECTURE OF EXCELLENCE</h2>
            <p className="text-[var(--color-grey-800)] max-w-2xl mx-auto">The core pillars that make RapidFix the premier destination for automotive engineering.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-none shadow-sm">
              <CardHeader>
                <div className="text-4xl font-bold text-[var(--color-grey-200)] mb-2">01</div>
                <CardTitle>Uncompromising Quality</CardTitle>
                <CardDescription className="text-base mt-2">
                  We refuse to cut corners. If a part isn't perfect, it doesn't go into your vehicle.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border-none shadow-sm">
              <CardHeader>
                <div className="text-4xl font-bold text-[var(--color-grey-200)] mb-2">02</div>
                <CardTitle>Data-Driven Diagnostics</CardTitle>
                <CardDescription className="text-base mt-2">
                  We don't guess. We analyze. Telemetry and precise scanning guide every wrench we turn.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border-none shadow-sm">
              <CardHeader>
                <div className="text-4xl font-bold text-[var(--color-grey-200)] mb-2">03</div>
                <CardTitle>Continuous Evolution</CardTitle>
                <CardDescription className="text-base mt-2">
                  Our engineers are constantly training on the latest EV architectures and hybrid systems.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
