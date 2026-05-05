"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useBookingStore } from "@/store/useBookingStore"
import { submitBooking } from "@/app/actions/booking"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar } from "@/components/ui/calendar-rac"
import { parseDate, getLocalTimeZone, today } from "@internationalized/date"

const BRANDS = [
  { name: "Tata", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg", type: ["Car"] },
  { name: "Mahindra", logo: "/brandLogos/mahindra.webp", type: ["Car"] },
  { name: "Hero", logo: "/brandLogos/hero.webp", type: ["Bike"] },
  { name: "Honda", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda_Logo.svg", type: ["Car", "Bike"] },
  { name: "Suzuki", logo: "/brandLogos/suzuki.webp", type: ["Car", "Bike"] },
  { name: "Hyundai", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg", type: ["Car"] },
  { name: "Jawa", logo: "/brandLogos/java.webp", type: ["Bike"] },
  { name: "Harley Davidson", logo: "/brandLogos/harley.webp", type: ["Bike"] },
  { name: "Volkswagen", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Volkswagen_Logo_till_1995.svg", type: ["Car"] },
  { name: "Audi", logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg", type: ["Car"] },
  { name: "BMW", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f4/BMW_logo_%28gray%29.svg", type: ["Car", "Bike"] },
  { name: "TVS", logo: "/brandLogos/tvs.webp", type: ["Bike"] },
  { name: "Skoda", logo: "/brandLogos/skoda.webp", type: ["Car"] },
  { name: "KIA", logo: "/brandLogos/kia.webp", type: ["Car"] },
  { name: "Mercedes", logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg", type: ["Car"] },
  { name: "Bajaj", logo: "/brandLogos/bajaj.webp", type: ["Bike"] },
  { name: "Ola Electric", logo: "/brandLogos/ola.webp", type: ["Bike"] },
  
];

const MODELS_BY_BRAND: Record<string, string[]> = {
  "Tata": ["Nexon", "Harrier", "Safari", "Punch", "Tiago", "Altroz"],
  "Mahindra": ["Thar", "XUV700", "Scorpio", "Bolero", "XUV300"],
  "Hero": ["Splendor", "Passion", "Xpulse", "Glamour", "Destini"],
  "Honda": ["City", "Amaze", "Civic", "Activa", "Shine", "Dio"],
  "Suzuki": ["Swift", "Baleno", "Brezza", "Access", "Burgman", "Gixxer"],
  "Hyundai": ["Creta", "Venue", "i20", "Verna", "Tucson"],
  "Jawa": ["Jawa 350", "Perak", "Bobber"],
  "Harley Davidson": ["Iron 883", "Street 750", "Fat Boy", "Pan America"],
  "Volkswagen": ["Polo", "Vento", "Taigun", "Virtus", "Tiguan"],
  "Audi": ["A4", "A6", "Q3", "Q5", "Q7"],
  "BMW": ["3 Series", "5 Series", "X1", "X3", "G 310 R", "S 1000 RR"],
  "TVS": ["Jupiter", "Apache", "Ntorq", "Ronin", "Raider"],
  "Skoda": ["Slavia", "Kushaq", "Octavia", "Superb", "Kodiaq"],
  "KIA": ["Seltos", "Sonet", "Carens", "EV6"],
  "Mercedes": ["C-Class", "E-Class", "GLC", "GLE", "S-Class"],
  "Bajaj": ["Pulsar", "Discover", "Dominar", "Chetak", "Platina"],
  "Ola Electric": ["S1 Pro", "S1 Pro Gen 3","S1 Pro+ 3rd Gen", "S1 Air", "S1 X", "S1 Pro Gen 2"]
};

const SERVICES = [
  "BIKE SERVICE", "CAR SERVICE", "CAR AC REPAIR", "BATTERY", 
  "TYRE & WHEEL", "ENGINE REPAIR", "DENTING & PAINTING", "EV SERVICE"
];

export default function Booking() {
  const searchParams = useSearchParams();
  const { 
    step, vehicleType, engineType, brand, model, serviceType, date, 
    setStep, setVehicleType, setEngineType, setBrand, setModel, setServiceType, setDate, reset, getEstimate 
  } = useBookingStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{success: boolean, bookingId: string, message: string} | null>(null);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [customModel, setCustomModel] = useState("");

  useEffect(() => {
    // If arriving from a link with a ?service= param, set it
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      const formatted = serviceParam.toUpperCase().replace(/_/g, ' ');
      if (SERVICES.includes(formatted)) {
        setServiceType(formatted);
      } else if (formatted === "TYRE WHEEL") {
        setServiceType("TYRE & WHEEL");
      }
    }
  }, [searchParams, setServiceType]);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!vehicleType || !engineType || !brand || !model || !serviceType || !date) return;
    
    setIsSubmitting(true);
    try {
      const result = await submitBooking({
        vehicleType,
        serviceType,
        date,
        estimate: getEstimate()
      });
      setBookingResult(result);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModelSelect = (m: string) => {
    if (m === "Other") {
      setModel("Other");
    } else {
      setModel(m);
      setCustomModel("");
    }
  };

  if (bookingResult) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center bg-[var(--color-grey-100)]">
        <Card className="max-w-md w-full p-8 text-center border-none shadow-xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--color-success)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Booking Confirmed</h2>
          <p className="text-[var(--color-grey-800)] mb-6">{bookingResult.message}</p>
          <div className="bg-[var(--color-grey-100)] p-4 rounded-md mb-8">
            <p className="text-sm font-bold text-[var(--color-grey-800)] mb-1">BOOKING ID</p>
            <p className="text-xl font-mono">{bookingResult.bookingId}</p>
          </div>
          <Button 
            className="w-full" 
            onClick={() => {
              reset();
              setBookingResult(null);
            }}
          >
            Book Another Service
          </Button>
        </Card>
      </div>
    );
  }

  const filteredBrands = BRANDS.filter(b => vehicleType ? b.type.includes(vehicleType) : true);
  const availableModels = brand ? [...(MODELS_BY_BRAND[brand] || []), "Other"] : [];

  return (
    <div className="w-full min-h-[80vh] bg-[var(--color-grey-100)] py-16">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Progress Bar */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[var(--color-grey-300)] -z-10 rounded-full"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-primary)] -z-10 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            ></div>
            
            {[1, 2, 3, 4, 5].map((num) => (
              <div 
                key={num}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-colors border-2 ${
                  step >= num 
                    ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white" 
                    : "bg-white border-[var(--color-grey-300)] text-[var(--color-grey-800)]"
                }`}
              >
                {step > num ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> : num}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-lg p-6 md:p-8">
              
              {/* Step 1: Vehicle Type */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <h2 className="text-2xl font-bold uppercase">Vehicle Type</h2>
                    <p className="text-[var(--color-grey-800)]">Select car or bike.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Car", "Bike"].map((type) => (
                      <div 
                        key={type}
                        onClick={() => setVehicleType(type)}
                        className={`p-6 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center gap-4 ${
                          vehicleType === type 
                            ? "border-[var(--color-primary)] bg-red-50 text-[var(--color-primary)]" 
                            : "border-[var(--color-grey-200)] hover:border-[var(--color-black)] bg-white"
                        }`}
                      >
                        <h3 className="font-black text-2xl uppercase">{type}</h3>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 flex justify-end">
                    <Button onClick={handleNext} disabled={!vehicleType}>
                      Next Step <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Engine Type */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <h2 className="text-2xl font-bold uppercase">Engine Type</h2>
                    <p className="text-[var(--color-grey-800)]">Select electric or fuel type.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {["Petrol", "Diesel", "CNG", "Hybrid", "Electric"].map((type) => (
                      <div 
                        key={type}
                        onClick={() => setEngineType(type)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
                          engineType === type 
                            ? "border-[var(--color-primary)] bg-red-50 text-[var(--color-primary)]" 
                            : "border-[var(--color-grey-200)] hover:border-[var(--color-black)] bg-white"
                        }`}
                      >
                        <h3 className="font-bold text-lg uppercase">{type}</h3>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={handleNext} disabled={!engineType}>
                      Next Step <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Brand & Model */}
              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <h2 className="text-2xl font-bold uppercase">Select Brand</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {filteredBrands.map((b) => (
                        <div 
                          key={b.name}
                          onClick={() => setBrand(b.name)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                            brand === b.name 
                              ? "border-[var(--color-primary)] bg-red-50" 
                              : "border-[var(--color-grey-200)] hover:border-[var(--color-black)] bg-white"
                          }`}
                        >
                          <img src={b.logo} alt={b.name} className={`w-12 h-12 object-contain ${brand === b.name ? 'grayscale-0' : 'grayscale'}`} />
                          <span className="text-xs font-bold uppercase tracking-wider text-center">{b.name}</span>
                        </div>
                      ))}
                      {/* "Other" Brand Option */}
                      <div 
                        onClick={() => setBrand("Other")}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                          brand === "Other" 
                            ? "border-[var(--color-primary)] bg-red-50" 
                            : "border-[var(--color-grey-200)] hover:border-[var(--color-black)] bg-white"
                        }`}
                      >
                        <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-[var(--color-grey-100)] ${brand === "Other" ? 'text-[var(--color-primary)]' : 'text-black'}`}>
                          <span className="font-bold text-lg">?</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-center">Other</span>
                      </div>
                    </div>
                  </div>

                  {brand && (
                    <div className="animate-in fade-in duration-300">
                      <h2 className="text-2xl font-bold uppercase mb-4">Select Model</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {availableModels.map((m) => (
                          <div 
                            key={m}
                            onClick={() => handleModelSelect(m)}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                              model === m || (m === "Other" && model === "Other")
                                ? "border-[var(--color-primary)] bg-red-50 text-[var(--color-primary)]" 
                                : "border-[var(--color-grey-200)] hover:border-[var(--color-black)] bg-white"
                            }`}
                          >
                            <span className="font-bold text-sm uppercase">{m}</span>
                          </div>
                        ))}
                      </div>
                      
                      {model === "Other" && (
                        <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                          <input 
                            type="text" 
                            placeholder="Type your model name..."
                            value={customModel}
                            onChange={(e) => setCustomModel(e.target.value)}
                            className="w-full p-3 border-2 border-[var(--color-black)] bg-white focus:outline-none focus:border-[var(--color-primary)] font-bold"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-6 flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={handleNext} disabled={!brand || !model || (model === "Other" && !customModel)}>
                      Next Step <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <style dangerouslySetInnerHTML={{__html: `
                    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: var(--color-grey-200); border-radius: 10px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--color-grey-400); border-radius: 10px; }
                  `}} />
                </div>
              )}

              {/* Step 4: Service Type */}
              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <h2 className="text-2xl font-bold uppercase">Select Service</h2>
                    <p className="text-[var(--color-grey-800)]">Choose the required service from the dropdown.</p>
                  </div>
                  
                  <div className="relative w-full max-w-md">
                    <button 
                      onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                      className="w-full p-4 border-2 border-[var(--color-black)] bg-[var(--color-grey-100)] font-black tracking-widest text-[var(--color-primary)] uppercase flex justify-between items-center"
                    >
                      {serviceType || "SELECT SERVICE"}
                      <ChevronDown className={`transition-transform ${isServiceDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {isServiceDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 w-full mt-2 bg-[var(--color-grey-100)] border-2 border-[var(--color-black)] flex flex-col shadow-2xl overflow-hidden z-50"
                        >
                          {SERVICES.map((service, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setServiceType(service);
                                setIsServiceDropdownOpen(false);
                              }}
                              className="relative z-0 px-4 py-3 text-sm font-black tracking-widest text-[var(--color-primary)] uppercase border-b border-[var(--color-grey-300)] overflow-hidden group text-left"
                            >
                              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                                {service}
                              </span>
                              <div className="absolute inset-0 bg-[var(--color-primary)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-[-1]" />
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="pt-16 flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={handleNext} disabled={!serviceType}>
                      Next Step <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 5: Schedule */}
              {step === 5 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <h2 className="text-2xl font-bold uppercase">Schedule Bay Time</h2>
                    <p className="text-[var(--color-grey-800)]">Select an available date for drop-off.</p>
                  </div>
                  
                  <div className="flex justify-center sm:justify-start">
                    <Calendar 
                      className="rounded-lg border-2 border-[var(--color-black)] p-4 bg-white shadow-md" 
                      value={date ? parseDate(date) : null} 
                      onChange={(v) => setDate(v.toString())} 
                      minValue={today(getLocalTimeZone())}
                    />
                  </div>

                  <div className="pt-6 flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={handleSubmit} disabled={!date || isSubmitting}>
                      {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</> : "Confirm Booking"}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-[var(--color-black)] shadow-lg sticky top-24 bg-white text-[var(--color-black)] overflow-hidden">
              <CardHeader className="bg-[var(--color-black)] text-white p-6">
                <CardTitle className="text-white text-2xl font-black tracking-widest uppercase">Estimate</CardTitle>
                <CardDescription className="text-[var(--color-grey-300)] font-bold">LIVE CALCULATION</CardDescription>
              </CardHeader>
              <div className="p-6 space-y-4">
                
                <div className="flex justify-between items-center border-b border-[var(--color-grey-200)] pb-3">
                  <span className="text-[var(--color-grey-600)] font-bold text-sm uppercase">Vehicle</span>
                  <span className="font-black text-right">{vehicleType || "—"}</span>
                </div>

                <div className="flex justify-between items-center border-b border-[var(--color-grey-200)] pb-3">
                  <span className="text-[var(--color-grey-600)] font-bold text-sm uppercase">Engine</span>
                  <span className="font-black text-right">{engineType || "—"}</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-[var(--color-grey-200)] pb-3">
                  <span className="text-[var(--color-grey-600)] font-bold text-sm uppercase">Brand</span>
                  <span className="font-black text-right">{brand || "—"}</span>
                </div>

                <div className="flex justify-between items-center border-b border-[var(--color-grey-200)] pb-3">
                  <span className="text-[var(--color-grey-600)] font-bold text-sm uppercase">Model</span>
                  <span className="font-black text-right">{model === "Other" && customModel ? customModel : (model || "—")}</span>
                </div>

                <div className="flex justify-between items-center border-b border-[var(--color-grey-200)] pb-3">
                  <span className="text-[var(--color-grey-600)] font-bold text-sm uppercase">Service</span>
                  <span className="font-black text-right text-xs max-w-[150px]">{serviceType || "—"}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2">
                  <span className="text-[var(--color-grey-600)] font-bold text-sm uppercase">Date</span>
                  <span className="font-black text-right">{date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "—"}</span>
                </div>

                <div className="bg-[var(--color-grey-100)] p-4 rounded-lg mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black uppercase">Booking Charge</span>
                    <span className="text-3xl font-black text-[var(--color-primary)]">₹{getEstimate()}</span>
                  </div>
                  <p className="text-[10px] text-[var(--color-grey-600)] mt-2 font-bold uppercase text-center">
                    *Cost will vary additionally according to parts and work
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
