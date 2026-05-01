import Link from "next/link"

export function Footer() {
  return (

    <footer id="contact" className="bg-[var(--color-black)] text-[var(--color-white)] py-16">

      <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link href="/" className="text-2xl font-bold tracking-tight inline-block mb-4">
            RAPID<span className="text-[var(--color-primary)]">FIX</span>
          </Link>
          <p className="text-[var(--color-grey-300)] text-sm max-w-xs">
            Precision engineering and high-performance automotive repair. Dialed in for perfection.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">NAVIGATION</h4>
          <ul className="space-y-2 text-sm text-[var(--color-grey-300)]">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link href="/booking" className="hover:text-white transition-colors">Book Online</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">SERVICES</h4>
          <ul className="space-y-2 text-sm text-[var(--color-grey-300)]">
            <li>Bike Service</li>
            <li>Car Service</li>
            <li>Car AC Repair</li>
            <li>Battery</li>
            <li>Tyre & Wheel</li>
            <li>Engine Repair</li>
            <li>Denting & Painting</li>
            <li>EV Service</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">CONTACT</h4>
          <ul className="space-y-2 text-sm text-[var(--color-grey-300)]">
            <li>96678 91434</li>
            <li>support@rapidfix.com</li>
            <li>Sector 120, Noida, Uttar Pradesh 201301, India</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-8 mt-12 pt-8 border-t border-[var(--color-grey-800)] text-sm text-[var(--color-grey-300)] flex flex-col md:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} RapidFix. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
