import { create } from "zustand";
import { persist } from "zustand/middleware";

type BookingState = {
  step: number;
  vehicleType: string | null;
  engineType: string | null;
  brand: string | null;
  model: string | null;
  bikeCC: string | null;
  serviceType: string | null;
  date: string | null;

  // Checkout fields
  location: string;
  address: {
    flat: string;
    area: string;
    landmark: string;
  };
  contact: string;
  problem: string;
  paymentMethod: "now" | "later" | null;

  setStep: (step: number) => void;
  setVehicleType: (type: string) => void;
  setEngineType: (type: string) => void;
  setBrand: (brand: string) => void;
  setModel: (model: string) => void;
  setBikeCC: (cc: string) => void;
  setServiceType: (type: string) => void;
  setDate: (date: string) => void;

  setLocation: (location: string) => void;
  setAddress: (address: Partial<BookingState["address"]>) => void;
  setContact: (contact: string) => void;
  setProblem: (problem: string) => void;
  setPaymentMethod: (method: "now" | "later") => void;

  reset: () => void;
  getEstimate: () => number;
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      step: 1,
      vehicleType: null,
      engineType: null,
      brand: null,
      model: null,
      bikeCC: null,
      serviceType: null,
      date: null,

      location: "",
      address: {
        flat: "",
        area: "",
        landmark: "",
      },
      contact: "",
      problem: "",
      paymentMethod: null,

      setStep: (step) => set({ step }),
      setVehicleType: (type) =>
        set({
          vehicleType: type,
          engineType: null,
          brand: null,
          model: null,
          bikeCC: null,
          serviceType: null,
        }),
      setEngineType: (type) =>
        set({ engineType: type, brand: null, model: null, bikeCC: null }),
      setBrand: (brand) => set({ brand, model: null, bikeCC: null }),
      setModel: (model) => set({ model, bikeCC: null }),
      setBikeCC: (cc) => set({ bikeCC: cc, serviceType: null }),
      setServiceType: (type) => set({ serviceType: type }),
      setDate: (date) => set({ date }),

      setLocation: (location) => set({ location }),
      setAddress: (newAddress) =>
        set((state) => ({
          address: { ...state.address, ...newAddress },
        })),
      setContact: (contact) => set({ contact }),
      setProblem: (problem) => set({ problem }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

      reset: () =>
        set({
          step: 1,
          vehicleType: null,
          engineType: null,
          brand: null,
          model: null,
          bikeCC: null,
          serviceType: null,
          date: null,
          location: "",
          address: { flat: "", area: "", landmark: "" },
          contact: "",
          problem: "",
          paymentMethod: null,
        }),

      getEstimate: () => {
        const { vehicleType, serviceType, bikeCC, engineType } = get();
        if (!serviceType) return 0;

        if (vehicleType === "Bike") {
          if (serviceType === "General Service") {
            if (engineType === "Electric") return 799;
            if (bikeCC === "0 - 150 CC") return 799;
            if (bikeCC === "150 - 250 CC") return 899;
            if (bikeCC === "250 - 400 CC") return 999;
            if (bikeCC === "400 - 450 CC") return 1049;
            if (bikeCC === "450 - 650 CC") return 1099;
            if (bikeCC === "650+ CC") return 1299;
            return 799;
          }
          if (serviceType === "General Service with Engine Oil") {
            if (engineType === "Electric") return 1249;
            if (bikeCC === "0 - 150 CC") return 1249;
            if (bikeCC === "150 - 250 CC") return 1349;
            if (bikeCC === "250 - 400 CC") return 2549;
            if (bikeCC === "400 - 450 CC") return 2599;
            if (bikeCC === "450 - 650 CC") return 2649;
            if (bikeCC === "650+ CC") return 2999;
            return 1249;
          }
          if (serviceType === "Jumpstart") return 450;
          if (serviceType === "Puncture") return 600;
        }

        if (vehicleType === "Car") {
          if (serviceType === "Basic Service") return 2800;
          if (serviceType === "Standard Service") return 4200;
          if (serviceType === "Comprehensive Service") return 6800;
          if (serviceType === "Jumpstart") return 999;
          if (serviceType === "Puncture") return 999;
          if (serviceType === "AC service") return 1499;
        }

        return 0;
      },
    }),
    {
      name: "rapidfix-booking-storage",
    },
  ),
);
