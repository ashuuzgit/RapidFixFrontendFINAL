"use server"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Explore all RapidFix automotive services — engine repair, AC service, tyre & wheel, denting & painting, EV service and more.",
  alternates: { canonical: "https://rapidfixauto.in/actions" },
};

export async function submitBooking(data: { 
  vehicleType: string, 
  engineType?: string,
  bikeCC?: string,
  brand: string,
  model: string,
  serviceType: string, 
  date: string, 
  estimate: number,
  location: string,
  address: { flat: string, area: string, landmark: string },
  contact: string,
  problem?: string,
  paymentMethod: string
}) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  console.log("Booking Confirmed:", data);

  return { 
    success: true, 
    bookingId: `RFX-${Math.floor(100000 + Math.random() * 900000)}`,
    message: "Your booking has been secured. Our team will contact you shortly for confirmation." 
  };
}
