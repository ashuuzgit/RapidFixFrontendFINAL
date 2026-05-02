import { create } from 'zustand'

type BookingState = {
  step: number;
  vehicleType: string | null;
  engineType: string | null;
  brand: string | null;
  model: string | null;
  serviceType: string | null;
  date: string | null;
  
  setStep: (step: number) => void;
  setVehicleType: (type: string) => void;
  setEngineType: (type: string) => void;
  setBrand: (brand: string) => void;
  setModel: (model: string) => void;
  setServiceType: (type: string) => void;
  setDate: (date: string) => void;
  reset: () => void;
  getEstimate: () => number;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  step: 1,
  vehicleType: null,
  engineType: null,
  brand: null,
  model: null,
  serviceType: null,
  date: null,
  
  setStep: (step) => set({ step }),
  setVehicleType: (type) => set({ vehicleType: type, engineType: null, brand: null, model: null, serviceType: null }),
  setEngineType: (type) => set({ engineType: type, brand: null, model: null }),
  setBrand: (brand) => set({ brand, model: null }),
  setModel: (model) => set({ model }),
  setServiceType: (type) => set({ serviceType: type }),
  setDate: (date) => set({ date }),
  
  reset: () => set({ 
    step: 1, 
    vehicleType: null, 
    engineType: null,
    brand: null,
    model: null,
    serviceType: null, 
    date: null 
  }),
  
  getEstimate: () => {
    return 399; // Flat base price
  }
}))
