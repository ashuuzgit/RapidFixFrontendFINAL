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
    let total = 399; // Bare minimum for each service
    const state = get();
    
    // Engine type modifiers
    if (state.engineType === 'Hybrid') total += 200;
    if (state.engineType === 'Electric') total += 100;

    // Service type cost
    if (state.serviceType === 'BIKE SERVICE') total += 100;
    if (state.serviceType === 'CAR SERVICE') total += 600;
    if (state.serviceType === 'CAR AC REPAIR') total += 400;
    if (state.serviceType === 'BATTERY') total += 200;
    if (state.serviceType === 'TYRE & WHEEL') total += 150;
    if (state.serviceType === 'ENGINE REPAIR') total += 2500;
    if (state.serviceType === 'DENTING & PAINTING') total += 1500;
    if (state.serviceType === 'EV SERVICE') total += 600;

    return total;
  }
}))
