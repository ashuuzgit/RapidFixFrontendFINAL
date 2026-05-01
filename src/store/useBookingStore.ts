import { create } from 'zustand'

type BookingState = {
  step: number;
  vehicleType: string | null;
  serviceType: string | null;
  date: string | null;
  setStep: (step: number) => void;
  setVehicleType: (type: string) => void;
  setServiceType: (type: string) => void;
  setDate: (date: string) => void;
  reset: () => void;
  getEstimate: () => number;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  step: 1,
  vehicleType: null,
  serviceType: null,
  date: null,
  setStep: (step) => set({ step }),
  setVehicleType: (type) => set({ vehicleType: type }),
  setServiceType: (type) => set({ serviceType: type }),
  setDate: (date) => set({ date }),
  reset: () => set({ step: 1, vehicleType: null, serviceType: null, date: null }),
  getEstimate: () => {
    let total = 0;
    const state = get();
    
    // Base vehicle type cost
    if (state.vehicleType === 'Sports') total += 500;
    if (state.vehicleType === 'Luxury') total += 300;
    if (state.vehicleType === 'SUV') total += 200;
    if (state.vehicleType === 'Sedan') total += 150;

    // Service type cost
    if (state.serviceType === 'Diagnostics') total += 150;
    if (state.serviceType === 'Routine') total += 300;
    if (state.serviceType === 'Performance') total += 1200;
    if (state.serviceType === 'Rebuild') total += 3500;

    return total;
  }
}))
