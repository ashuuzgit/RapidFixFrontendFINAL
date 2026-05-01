"use client"

import { useState } from "react"
import { useBookingStore } from "@/store/useBookingStore"
import { submitBooking } from "@/app/actions/booking"
import { Button } from "@antigravity/ui/Button"
import { Card, CardHeader, CardTitle, CardDescription } from "@antigravity/ui/Card"
import { Badge } from "@antigravity/ui/Badge"
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2, Calendar } from "lucide-react"

export default function Booking() {
  const { step, vehicleType, serviceType, date, setStep, setVehicleType, setServiceType, setDate, reset, getEstimate } = useBookingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{success: boolean, bookingId: string, message: string} | null>(null);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!vehicleType || !serviceType || !date) return;
    
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

  return (
    <div className="w-full min-h-[80vh] bg-[var(--color-grey-100)] py-16">
      <div className="container mx-auto px-8 max-w-6xl">
        
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[var(--color-grey-300)] -z-10 rounded-full"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-primary)] -z-10 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
            
            {[1, 2, 3].map((num) => (
              <div 
                key={num}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 ${
                  step >= num 
                    ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white" 
                    : "bg-white border-[var(--color-grey-300)] text-[var(--color-grey-800)]"
                }`}
              >
                {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-bold text-[var(--color-grey-800)] px-2">
            <span>VEHICLE</span>
            <span>SERVICE</span>
            <span>SCHEDULE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-lg p-8">
              
              {/* Step 1: Vehicle Type */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-bold">Select Vehicle Architecture</h2>
                  <p className="text-[var(--color-grey-800)]">Choose the chassis type to calibrate our systems.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Sports", "Luxury", "SUV", "Sedan"].map((type) => (
                      <div 
                        key={type}
                        onClick={() => setVehicleType(type)}
                        className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                          vehicleType === type 
                            ? "border-[var(--color-primary)] bg-red-50" 
                            : "border-[var(--color-grey-200)] hover:border-[var(--color-black)]"
                        }`}
                      >
                        <h3 className="font-bold text-lg">{type}</h3>
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

              {/* Step 2: Service Type */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-bold">Required Engineering</h2>
                  <p className="text-[var(--color-grey-800)]">Select the level of service required.</p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { name: "Diagnostics", desc: "Full telemetry scan and physical inspection." },
                      { name: "Routine", desc: "Fluids, filters, and standard maintenance." },
                      { name: "Performance", desc: "Tuning and bolt-on upgrades." },
                      { name: "Rebuild", desc: "Complete engine or transmission tear-down." }
                    ].map((service) => (
                      <div 
                        key={service.name}
                        onClick={() => setServiceType(service.name)}
                        className={`p-6 rounded-lg border-2 cursor-pointer transition-all flex justify-between items-center ${
                          serviceType === service.name 
                            ? "border-[var(--color-primary)] bg-red-50" 
                            : "border-[var(--color-grey-200)] hover:border-[var(--color-black)]"
                        }`}
                      >
                        <div>
                          <h3 className="font-bold text-lg">{service.name}</h3>
                          <p className="text-sm text-[var(--color-grey-800)] mt-1">{service.desc}</p>
                        </div>
                        {serviceType === service.name && <CheckCircle2 className="text-[var(--color-primary)] w-6 h-6" />}
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={handleNext} disabled={!serviceType}>
                      Next Step <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Date */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-bold">Schedule Bay Time</h2>
                  <p className="text-[var(--color-grey-800)]">Select an available date for drop-off.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Simplified calendar selection for prototype */}
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((dayOffset) => {
                      const d = new Date();
                      d.setDate(d.getDate() + dayOffset);
                      const dateStr = d.toISOString().split('T')[0];
                      const displayDay = d.toLocaleDateString('en-US', { weekday: 'short' });
                      const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      
                      return (
                        <div 
                          key={dateStr}
                          onClick={() => setDate(dateStr)}
                          className={`p-4 rounded-lg border-2 text-center cursor-pointer transition-all ${
                            date === dateStr 
                              ? "border-[var(--color-primary)] bg-red-50 text-[var(--color-primary)]" 
                              : "border-[var(--color-grey-200)] hover:border-[var(--color-black)]"
                          }`}
                        >
                          <div className="text-xs font-bold mb-1 uppercase">{displayDay}</div>
                          <div className="text-lg font-bold">{displayDate}</div>
                        </div>
                      )
                    })}
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
            <Card className="border-none shadow-lg sticky top-24 bg-[var(--color-black)] text-white">
              <CardHeader className="border-b border-[var(--color-grey-800)]">
                <CardTitle className="text-white">Estimate</CardTitle>
                <CardDescription className="text-[var(--color-grey-300)]">Real-time dynamic pricing</CardDescription>
              </CardHeader>
              <div className="p-6 space-y-4">
                
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-grey-300)]">Vehicle</span>
                  <span className="font-bold">{vehicleType || "—"}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-grey-300)]">Service</span>
                  <span className="font-bold">{serviceType || "—"}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-grey-300)]">Date</span>
                  <span className="font-bold">{date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "—"}</span>
                </div>

                <div className="border-t border-[var(--color-grey-800)] pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total Estimate</span>
                    <span className="text-2xl font-bold text-[var(--color-primary)]">${getEstimate()}</span>
                  </div>
                  <p className="text-xs text-[var(--color-grey-300)] mt-2">
                    *Final price may vary based on actual diagnostics.
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
