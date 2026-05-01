"use server"

export async function submitBooking(data: { vehicleType: string, serviceType: string, date: string, estimate: number }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  console.log("Booking Confirmed:", data);

  return { 
    success: true, 
    bookingId: `RFX-${Math.floor(Math.random() * 100000)}`,
    message: "Your booking has been secured. Our engineers will be ready for your arrival." 
  };
}
