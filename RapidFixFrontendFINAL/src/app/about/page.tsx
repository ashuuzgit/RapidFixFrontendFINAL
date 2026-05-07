import { LinkCard } from "@/components/ui/link-card"

const architectureCards = [
  {
    title: 'Uncompromising Quality',
    description: "We refuse to cut corners. If a part isn't perfect, it doesn't go into your vehicle.",
    imageUrl: '/engine.webp',
    href: '#',
  },
  {
    title: 'Data-Driven Diagnostics',
    description: "We don't guess. We analyze. Telemetry and precise scanning guide every wrench we turn.",
    imageUrl: '/sanding.webp',
    href: '#',
  },
  {
    title: 'Continuous Evolution',
    description: "Our engineers are constantly training on the latest EV architectures and hybrid systems.",
    imageUrl: '/oil.webp',
    href: '#',
  }
];

export default function About() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-[var(--color-primary)] text-white border-b-2 border-black">
        <div className="container mx-auto px-4 md:px-8 py-24 md:py-32">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">
            PRECISION REDEFINED.
          </h1>
          <p className="text-xl md:text-2xl font-medium text-white/90 max-w-3xl">
            The story behind RapidFix and our relentless pursuit of mechanical perfection.
          </p>
        </div>
      </section>

      {/* Narrative & YouTube Section */}
      <section className="bg-white border-b-2 border-black">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
          {/* Text Section */}
          <div className="p-8 md:p-16 space-y-8 flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-black">
              BORN FROM PASSION.<br />BUILT FOR THE ROAD.
            </h2>
            <div className="space-y-6 text-lg font-medium text-black/80">
              <p>
                RapidFix was founded by Farzan Saifi, a mechanic driven by a lifelong obsession and an encyclopedic knowledge of automobiles. Farzan grew tired of the "good enough" industry standard. He didn’t just want to fix cars; he wanted to bring out their absolute best. Every vehicle that enters our shop is treated with the same profound respect, care, and meticulous attention to detail that a master craftsman gives his own prized build.
              </p>
              <p>
                Our facility is equipped with top-tier tools and backed by a deep, hands-on understanding of what makes an engine truly sing. We believe in honest work, unwavering precision, and reliable performance above all else. When you leave your keys with Farzan, you're not just a customer—you're a fellow enthusiast trusting us with your machine.
              </p>
            </div>
          </div>
          
          {/* YouTube Section instead of image */}
          <div className="p-8 md:p-16 flex flex-col justify-center items-center bg-[var(--color-grey-100)]">
            <h3 className="text-3xl font-black uppercase tracking-tight mb-8 text-center text-black flex items-center gap-3">
              <svg className="w-8 h-8 text-[var(--color-primary)] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Checkout Our YouTube
            </h3>
            <LinkCard 
              title="RapidFix Garage" 
              description="Watch our master craftsmen at work. Deep dives, engine rebuilds, and behind the scenes." 
              imageUrl="/youtube.webp" 
              centeredImage={true}
              href="https://www.youtube.com/@Farzansaifivlogs786" 
              className="bg-white border-2 border-black text-black w-full"
            />
          </div>
        </div>
      </section>

      {/* Architecture / Milestones */}
      <section className="py-16 md:py-24 bg-[var(--color-grey-100)] border-b-2 border-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 text-black">THE ARCHITECTURE OF EXCELLENCE</h2>
            <p className="text-lg font-medium text-black/70 max-w-2xl mx-auto">
              The core pillars that make RapidFix the premier destination for authentic, high-quality automotive care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            {architectureCards.map((card, index) => (
              <LinkCard 
                key={index}
                title={card.title}
                description={card.description}
                imageUrl={card.imageUrl}
                href={card.href}
                className="bg-white border-2 border-black text-black w-full"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
