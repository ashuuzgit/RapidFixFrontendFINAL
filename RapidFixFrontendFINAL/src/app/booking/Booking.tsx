"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useBookingStore } from "@/store/useBookingStore";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Wrench,
  Droplets,
  Zap,
  CircleDot,
  Settings,
  ShieldCheck,
  Trophy,
  Snowflake,
  Clock,
  Check,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "@/components/ui/calendar-rac";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";

const BIKE_BRANDS = [
  { name: "Hero", logo: "/brandLogos/hero.webp" },
  {
    name: "Honda",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda_Logo.svg",
  },
  { name: "TVS", logo: "/brandLogos/tvs.webp" },
  { name: "Bajaj", logo: "/brandLogos/bajaj.webp" },
  { name: "Royal Enfield", logo: "/brandLogos/Royal_Enfield.svg" },
  { name: "Yamaha", logo: "/brandLogos/yamaha.webp" },
  { name: "Suzuki", logo: "/brandLogos/suzuki.webp" },
  { name: "KTM", logo: "/brandLogos/KTM.svg" },
  { name: "Jawa", logo: "/brandLogos/java.webp" },
  {
    name: "BMW",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f4/BMW_logo_%28gray%29.svg",
  },
  { name: "Benelli", logo: "/brandLogos/benelli.png" },
  { name: "Ducati", logo: "/brandLogos/ducati.svg" },
  { name: "Harley Davidson", logo: "/brandLogos/harley.webp" },
  { name: "Husqvarna", logo: "/brandLogos/Husqvarna.svg" },
  { name: "Hyosung", logo: "/brandLogos/hyosung.svg" },
  { name: "Indian", logo: "/brandLogos/indian.svg" },
  { name: "Kawasaki", logo: "/brandLogos/kawasaki.svg" },
  { name: "Triumph", logo: "/brandLogos/triumph.svg" },
  { name: "Ola Electric", logo: "/brandLogos/ola.webp" },
];

const BIKE_MODELS_BY_BRAND: Record<string, string[]> = {
  Hero: [
    "Splendor Plus",
    "HF Deluxe",
    "Passion Pro",
    "Glamour",
    "Xtreme 160R",
    "Xpulse 200",
    "Xpulse 200T",
    "Destini 125",
    "Maestro Edge 125",
  ],
  Honda: [
    "Activa 6G",
    "Shine 100",
    "SP 125",
    "Dio",
    "Unicorn",
    "Hornet 2.0",
    "CB300R",
    "CB650R",
    "Africa Twin",
  ],
  TVS: [
    "Jupiter",
    "Ntorq 125",
    "Raider 125",
    "Apache RTR 160",
    "Apache RTR 200 4V",
    "Apache RR 310",
    "Ronin",
    "iQube Electric",
    "Star City+",
  ],
  Bajaj: [
    "Pulsar 125",
    "Pulsar 150",
    "Pulsar 220F",
    "Pulsar NS200",
    "Pulsar RS200",
    "Dominar 250",
    "Dominar 400",
    "Discover 125",
    "Chetak Electric",
    "Platina 110",
  ],
  "Royal Enfield": [
    "Classic 350",
    "Bullet 350",
    "Meteor 350",
    "Hunter 350",
    "Scram 411",
    "Himalayan 450",
    "Super Meteor 650",
    "Interceptor 650",
    "Continental GT 650",
  ],
  Yamaha: [
    "FZ-S V3",
    "FZ-X",
    "MT-15 V2",
    "YZF-R15 V4",
    "YZF-R3",
    "FZ25",
    "Aerox 155",
    "Fascino 125",
    "Ray ZR 125",
  ],
  Suzuki: [
    "Access 125",
    "Burgman Street 125",
    "Intruder 150",
    "Gixxer 150",
    "Gixxer SF 150",
    "Gixxer 250",
    "Gixxer SF 250",
    "V-Strom SX 250",
    "Hayabusa",
  ],
  KTM: [
    "Duke 125",
    "Duke 200",
    "Duke 250",
    "Duke 390",
    "RC 125",
    "RC 200",
    "RC 390",
    "Adventure 250",
    "Adventure 390",
  ],
  Jawa: [
    "Jawa 42",
    "Jawa 42 Bobber",
    "Jawa 350",
    "Perak",
    "Yezdi Roadster",
    "Yezdi Scrambler",
  ],
  BMW: [
    "G 310 R",
    "G 310 GS",
    "F 900 R",
    "F 900 XR",
    "S 1000 RR",
    "R 1250 GS",
    "M 1000 RR",
  ],
  Aprilia: ["SR 125", "SR 160", "SR 200", "Storm 125", "RS 457", "Tuono 660"],
  Benelli: ["TRK 502", "TRK 502X", "Leoncino 500", "502C", "302R", "TNT 600i"],
  Ducati: [
    "Monster",
    "Scrambler Icon",
    "Scrambler Desert Sled",
    "Panigale V2",
    "Panigale V4",
    "Multistrada V2",
    "DesertX",
  ],
  "Fb Mondial": [
    "HPS 125",
    "HPS 300",
    "Pagani 125",
    "SMX 125",
    "Flat Track 125",
  ],
  "Harley Davidson": [
    "Nightster",
    "Sportster S",
    "Iron 883",
    "Forty-Eight",
    "Fat Bob",
    "Fat Boy",
    "Street Glide",
    "Road Glide",
    "Pan America 1250",
  ],
  Husqvarna: [
    "Svartpilen 250",
    "Vitpilen 250",
    "Svartpilen 401",
    "Vitpilen 401",
  ],
  Hyosung: ["GT250R", "GT650R", "GV300S Aquila Pro", "GT250", "GD250N"],
  Indian: [
    "Scout",
    "Scout Bobber",
    "Chief",
    "Chieftain",
    "Springfield",
    "Challenger",
    "FTR 1200",
    "Pursuit",
  ],
  Kawasaki: [
    "Ninja 300",
    "Ninja 400",
    "Ninja 650",
    "Ninja ZX-10R",
    "Z650",
    "Z900",
    "Versys 650",
    "W175",
    "Eliminator 450",
  ],

  Triumph: [
    "Speed 400",
    "Scrambler 400 X",
    "Street Triple R",
    "Speed Triple 1200",
    "Tiger 900",
    "Tiger 1200",
    "Bonneville T100",
    "Bonneville T120",
    "Rocket 3",
  ],
  "Ola Electric": [
    "S1 Air",
    "S1 X",
    "S1 Pro",
    "S1 Pro Gen 2",
    "S1 Pro Gen 3",
    "S1 Pro+ 3rd Gen",
  ],
};

const CAR_BRANDS = [
  // Mass Market
  {
    name: "Tata",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg",
  },
  { name: "Mahindra", logo: "/brandLogos/mahindra.webp" },
  { name: "Maruti Suzuki", logo: "/brandLogos/suzuki.webp" },
  { name: "Hyundai", logo: "/brandLogos/Hyundai.webp" },
  {
    name: "Honda",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda_Logo.svg",
  },
  { name: "Toyota", logo: "/brandLogos/toyota.svg" },
  { name: "KIA", logo: "/brandLogos/kia.webp" },
  { name: "Renault", logo: "/brandLogos/Renault copy.webp" },
  { name: "Nissan", logo: "/brandLogos/nissan.webp" },
  { name: "MG Motor", logo: "/brandLogos/MG.svg" },
  { name: "Jeep", logo: "/brandLogos/jeep.svg" },
  { name: "Citroen", logo: "/brandLogos/citroen.svg" },
  // Premium
  { name: "Skoda", logo: "/brandLogos/skoda.webp" },
  {
    name: "Volkswagen",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Volkswagen_Logo_till_1995.svg",
  },
  // Luxury
  {
    name: "BMW",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f4/BMW_logo_%28gray%29.svg",
  },
  {
    name: "Mercedes",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg",
  },
  {
    name: "Audi",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg",
  },
  { name: "Volvo", logo: "/brandLogos/volvo.webp" },
  { name: "Lexus", logo: "/brandLogos/lexus.svg" },
  { name: "Land Rover", logo: "/brandLogos/landrover.webp" },
  { name: "Porsche", logo: "/brandLogos/porsche.png" },
];

const CAR_MODELS_BY_BRAND: Record<string, string[]> = {
  Tata: [
    "Punch",
    "Tiago",
    "Tigor",
    "Altroz",
    "Nexon",
    "Harrier",
    "Safari",
    "Nexon EV",
    "Punch EV",
    "Curvv",
    "Sierra EV",
  ],
  Mahindra: [
    "Bolero",
    "Bolero Neo",
    "XUV300",
    "Scorpio Classic",
    "Scorpio-N",
    "Thar",
    "Thar Roxx",
    "XUV400 EV",
    "XUV700",
    "BE 6e",
    "XEV 9e",
  ],
  "Maruti Suzuki": [
    "Alto K10",
    "S-Presso",
    "Celerio",
    "WagonR",
    "Swift",
    "Dzire",
    "Baleno",
    "Fronx",
    "Ignis",
    "Brezza",
    "Ertiga",
    "Grand Vitara",
    "XL6",
    "Invicto",
    "Jimny",
  ],
  Hyundai: [
    "Exter",
    "i20",
    "Venue",
    "Creta",
    "Creta Electric",
    "Alcazar",
    "Verna",
    "Tucson",
    "Ioniq 5",
    "Ioniq 6",
  ],
  Honda: ["Amaze", "City", "City Hybrid", "Elevate", "WR-V"],
  Toyota: [
    "Glanza",
    "Urban Cruiser Taisor",
    "Rumion",
    "Innova Crysta",
    "Innova Hycross",
    "Fortuner",
    "Fortuner Legender",
    "Hilux",
    "Camry",
    "Vellfire",
    "Land Cruiser 300",
  ],
  KIA: ["Sonet", "Seltos", "Carens", "EV6", "EV9", "Carnival"],
  Renault: ["Kwid", "Kiger", "Triber", "Duster"],
  Nissan: ["Magnite", "Kicks", "GT-R", "X-Trail"],
  "MG Motor": [
    "Comet EV",
    "Hector",
    "Hector Plus",
    "Astor",
    "Gloster",
    "ZS EV",
    "Windsor EV",
  ],
  Jeep: ["Compass", "Meridian", "Wrangler", "Grand Cherokee"],
  Citroen: ["C3", "C3 Aircross", "C5 Aircross", "eC3"],
  Skoda: ["Kushaq", "Slavia", "Kodiaq", "Octavia", "Superb", "Enyaq"],
  Volkswagen: ["Polo", "Vento", "Taigun", "Virtus", "Tiguan", "ID.4"],
  BMW: [
    "2 Series Gran Coupe",
    "3 Series",
    "5 Series",
    "7 Series",
    "X1",
    "X3",
    "X5",
    "X7",
    "iX",
    "i4",
    "i7",
    "M3",
    "M5",
  ],
  Mercedes: [
    "A-Class Limousine",
    "C-Class",
    "E-Class",
    "S-Class",
    "GLA",
    "GLB",
    "GLC",
    "GLE",
    "GLS",
    "EQB",
    "EQS",
    "G-Class",
    "AMG GT",
  ],
  Audi: [
    "A4",
    "A6",
    "A8",
    "Q3",
    "Q5",
    "Q7",
    "Q8",
    "e-tron",
    "e-tron GT",
    "RS5",
    "RS7",
  ],
  Volvo: [
    "XC40",
    "XC40 Recharge",
    "XC60",
    "XC90",
    "S60",
    "S90",
    "C40 Recharge",
    "EX40",
  ],
  Lexus: ["UX 300e", "NX", "RX", "ES", "LS", "LX", "LC 500"],
  "Land Rover": [
    "Defender",
    "Discovery",
    "Discovery Sport",
    "Freelander",
    "Range Rover",
    "Range Rover Sport",
    "Range Rover Velar",
    "Range Rover Evoque",
  ],
  Porsche: [
    "Macan",
    "Macan Electric",
    "Cayenne",
    "Cayenne Coupe",
    "Panamera",
    "Taycan",
    "911",
    "718 Boxster",
    "718 Cayman",
  ],
};

const BIKE_SERVICES = [
  {
    title: "General Service",
    description: "Available at Doorstep | 500 Kms or 1 Month Warranty",
    interval: "Every 3000 Kms or 3 Months (Recommended)",
    duration: "2 Hrs taken",
    features: [
      "Air Filter Cleaning",
      "Battery Voltage Check",
      "Brakes Service",
      "Cables & Levers Adjustment",
      "Chain Tension Check",
      "Clutch Greasing",
      "Dry Wash",
      "Electrical Check-up",
      "Engine Oil Check",
      "Greasing & Lubrication",
      "Oil Leakage Check",
      "Spark Plug Cleaning",
    ],
    prices: {
      "0 - 150": 799,
      "150 - 250": 899,
      "250 - 400": 999,
      "450 - 650": 1099,
    },
    icon: <Wrench className="w-6 h-6" />,
  },
  {
    title: "General Service with Engine Oil",
    description: "Available at Doorstep | 500 Kms or 1 Month Warranty",
    interval: "Every 3000 Kms or 3 Months (Recommended)",
    duration: "2 Hrs taken",
    features: [
      "Air Filter Cleaning",
      "Battery Voltage Check",
      "Brakes Service",
      "Cables & Levers Adjustment",
      "Chain Tension Check",
      "Clutch Greasing",
      "Dry Wash",
      "Electrical Check-up",
      "Engine Oil Change",
    ],
    prices: {
      "0 - 150": 1249,
      "150 - 250": 1349,
      "250 - 400": 2549,
      "450 - 650": 2649,
    },
    icon: <Droplets className="w-6 h-6" />,
  },
  {
    title: "Jumpstart",
    description: "Quick battery jumpstart at your location.",
    price: 450,
    icon: <Zap className="w-6 h-6" />,
  },
  {
    title: "Puncture",
    description: "On-site tire puncture repair.",
    price: 600,
    icon: <CircleDot className="w-6 h-6" />,
  },
];

const CAR_SERVICES = [
  {
    title: "Basic Service",
    description: "Free Pick Up and Drop | 1000 Kms or 1 Month Warranty",
    interval: "Every 5000 Kms or 3 Months (Recommended)",
    duration: "4 Hrs taken",
    features: [
      "Air Filter Cleaning",
      "Battery Water Top Up",
      "Car Wash",
      "Coolant Top Up (200 ml)",
      "Engine Oil Replacement",
      "Heater/Spark Plugs Checking",
      "Interior Vacuuming (Carpet & Seats)",
      "Oil Filter Replacement",
      "Wiper Fluid Replacement",
    ],
    price: 2800,
    icon: <Settings className="w-6 h-6" />,
  },
  {
    title: "Standard Service",
    description: "Free Pick Up and Drop | 1000 Kms or 1 Month Warranty",
    interval: "Every 10000 Kms or 6 Months (Recommended)",
    duration: "6 Hrs taken",
    features: [
      "Air Filter Replacement",
      "AC Filter Cleaning",
      "Battery Water Top Up",
      "Brake Fluid Top Up",
      "Car Scanning",
      "Car Wash",
      "Coolant Top Up (200 ml)",
      "Engine Oil Replacement",
      "Front Brake Pads Serviced",
      "Fuel Filter Checking",
      "Heater/Spark Plugs Checking",
      "Interior Vacuuming (Carpet & Seats)",
      "Oil Filter Replacement",
      "Rear Brake Shoes Serviced",
      "Wiper Fluid Replacement",
    ],
    price: 4200,
    icon: <ShieldCheck className="w-6 h-6" />,
  },
  {
    title: "Comprehensive Service",
    description: "Free Pick Up and Drop | 1000 Kms or 1 Month Warranty",
    interval: "Every 20000 Kms or 12 Months (Recommended)",
    duration: "8 Hrs taken",
    features: [
      "Air Filter Replacement",
      "AC Filter Replacement",
      "Battery Water Top Up",
      "Brake Fluid Top Up",
      "Car Scanning",
      "Car Wash",
      "Coolant Top Up (200 ml)",
      "Engine Oil Replacement",
      "Engine Flushing",
      "Front Brake Pads Serviced",
      "Fuel Filter Checking",
      "Gear Oil Top Up",
      "Heater/Spark Plugs Checking",
      "Interior Vacuuming (Carpet & Seats)",
      "Oil Filter Replacement",
      "Rear Brake Shoes Serviced",
      "Throttle Body Cleaning",
      "Tyre Rotation",
      "Wiper Fluid Replacement",
      "Wheel Alignment",
      "Wheel Balancing",
    ],
    price: 6800,
    icon: <Trophy className="w-6 h-6" />,
  },
  {
    title: "Jumpstart",
    description: "Emergency battery jumpstart service.",
    price: 999,
    icon: <Zap className="w-6 h-6" />,
  },
  {
    title: "Puncture",
    description: "Quick tire repair at your location.",
    price: 999,
    icon: <CircleDot className="w-6 h-6" />,
  },
  {
    title: "AC service",
    description: "Complete AC cooling system maintenance.",
    price: 1499,
    icon: <Snowflake className="w-6 h-6" />,
  },
];

export default function Booking() {
  const searchParams = useSearchParams();
  const {
    step,
    vehicleType,
    engineType,
    brand,
    model,
    bikeCC,
    serviceType,
    date,
    setStep,
    setVehicleType,
    setEngineType,
    setBrand,
    setModel,
    setBikeCC,
    setServiceType,
    setDate,
    reset,
    getEstimate,
  } = useBookingStore();

  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [customModel, setCustomModel] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // If arriving from a link with a ?service= param, set it
    const serviceParam = searchParams.get("service");
    if (serviceParam) {
      const formatted = serviceParam.toUpperCase().replace(/_/g, " ");
      // Basic check for legacy services, but now we have specific lists
      if (vehicleType === "Bike") {
        const found = BIKE_SERVICES.find(
          (s) => s.title.toUpperCase() === formatted,
        );
        if (found) setServiceType(found.title);
      } else {
        const found = CAR_SERVICES.find(
          (s) => s.title.toUpperCase() === formatted,
        );
        if (found) setServiceType(found.title);
      }
    }
  }, [searchParams, setServiceType, vehicleType]);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleModelSelect = (m: string) => {
    if (m === "Other") {
      setModel("Other");
    } else {
      setModel(m);
      setCustomModel("");
    }
  };

  const filteredBrands = vehicleType === "Bike" ? BIKE_BRANDS : CAR_BRANDS;
  const availableModels = brand
    ? [
        ...((vehicleType === "Bike"
          ? BIKE_MODELS_BY_BRAND
          : CAR_MODELS_BY_BRAND)[brand] || []),
        "Other",
      ]
    : [];

  if (!mounted) {
    return (
      <div className="w-full min-h-screen bg-[var(--color-grey-100)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[80vh] bg-[var(--color-grey-100)] py-16">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Progress Bar */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[var(--color-grey-300)] -z-10 rounded-full"></div>
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-primary)] -z-10 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>

            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-colors border-2 ${
                  step >= num
                    ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                    : "bg-white border-[var(--color-grey-300)] text-[var(--color-grey-800)]"
                }`}
              >
                {step > num ? (
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  num
                )}
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
                    <h2 className="text-2xl font-bold uppercase">
                      Vehicle Type
                    </h2>
                    <p className="text-[var(--color-grey-800)]">
                      Select car or bike.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Car", "Bike"].map((type) => (
                      <div
                        key={type}
                        onClick={() => setVehicleType(type)}
                        className={`h-20 md:h-24 rounded-none border-2 cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-4 group relative overflow-hidden ${
                          vehicleType === type
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                            : "border-[var(--color-grey-200)] bg-white text-black"
                        }`}
                      >
                        <div className="relative z-10 flex items-center gap-3">
                          <h3 className="font-black text-2xl md:text-3xl uppercase tracking-widest">
                            {type}
                          </h3>
                        </div>
                        {/* Premium Diagonal Hover */}
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 skew-y-12 origin-bottom"></div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleNext}
                    disabled={!vehicleType}
                    className="w-full md:w-64 h-14 md:h-16 text-lg font-black uppercase tracking-[0.2em] rounded-none group relative overflow-hidden bg-[var(--color-grey-200)] text-black border-2 border-black active:scale-95 transition-transform"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      Next Step{" "}
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 skew-y-12 origin-bottom"></div>
                  </Button>
                </div>
              )}

              {/* Step 2: Engine Type */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <h2 className="text-2xl font-bold uppercase">
                      Engine Type
                    </h2>
                    <p className="text-[var(--color-grey-800)]">
                      Select electric or fuel type.
                    </p>
                  </div>

                  <div
                    className={`grid gap-4 ${vehicleType === "Car" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-2"}`}
                  >
                    {(vehicleType === "Car"
                      ? ["Petrol", "Diesel", "CNG", "Hybrid", "Electric"]
                      : ["Petrol", "Electric"]
                    ).map((type) => (
                      <div
                        key={type}
                        onClick={() => setEngineType(type)}
                        className={`h-14 md:h-16 rounded-none border-2 cursor-pointer transition-all active:scale-95 flex items-center justify-center text-center group relative overflow-hidden ${
                          engineType === type
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                            : "border-[var(--color-grey-200)] bg-white text-black"
                        }`}
                      >
                        <h3 className="relative z-10 font-black text-base md:text-lg uppercase tracking-widest">
                          {type}
                        </h3>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 skew-y-12 origin-bottom"></div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 flex flex-col md:flex-row justify-between gap-4">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="w-full md:w-40 h-14 md:h-16 text-lg font-black uppercase tracking-[0.2em] rounded-none group relative overflow-hidden bg-white text-black border-2 border-black active:scale-95 transition-transform"
                    >
                      <div className="relative z-10 flex items-center justify-center gap-3">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />{" "}
                        Back
                      </div>
                      <div className="absolute inset-0 bg-black/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 skew-y-12 origin-bottom"></div>
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!engineType}
                      className="w-full md:w-64 h-14 md:h-16 text-lg font-black uppercase tracking-[0.2em] rounded-none group relative overflow-hidden bg-[var(--color-grey-200)] text-black border-2 border-black active:scale-95 transition-transform"
                    >
                      <div className="relative z-10 flex items-center justify-center gap-3">
                        Next Step{" "}
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </div>
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 skew-y-12 origin-bottom"></div>
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Brand & Model */}
              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <h2 className="text-2xl font-bold uppercase">
                      Select Brand
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {filteredBrands.map((b) => (
                        <div
                          key={b.name}
                          onClick={() => setBrand(b.name)}
                          className={`h-20 md:h-24 rounded-none border-2 cursor-pointer transition-all active:scale-95 flex flex-col items-center justify-center gap-2 group relative overflow-hidden ${
                            brand === b.name
                              ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                              : "border-[var(--color-grey-200)] bg-white text-black"
                          }`}
                        >
                          <img
                            src={b.logo}
                            alt={b.name}
                            className={`w-8 h-8 md:w-10 md:h-10 object-contain relative z-10 ${brand === b.name ? "brightness-0 invert" : ""}`}
                          />
                          <span className="text-[10px] font-black uppercase tracking-widest text-center relative z-10">
                            {b.name}
                          </span>
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 skew-y-12 origin-bottom"></div>
                        </div>
                      ))}
                      {/* "Other" Brand Option */}
                      <div
                        onClick={() => setBrand("Other")}
                        className={`h-20 md:h-24 rounded-none border-2 cursor-pointer transition-all active:scale-95 flex flex-col items-center justify-center gap-2 group relative overflow-hidden ${
                          brand === "Other"
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                            : "border-[var(--color-grey-200)] bg-white text-black"
                        }`}
                      >
                        <div
                          className={`relative z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full ${brand === "Other" ? "bg-white/20 text-white" : "bg-[var(--color-grey-100)] text-black"}`}
                        >
                          <span className="font-black text-sm md:text-lg">
                            ?
                          </span>
                        </div>
                        <span className="relative z-10 text-[10px] font-black uppercase tracking-widest text-center">
                          Other
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 skew-y-12 origin-bottom"></div>
                      </div>
                    </div>
                  </div>

                  {brand && (
                    <div className="animate-in fade-in duration-300">
                      <h2 className="text-2xl font-bold uppercase mb-4">
                        Select Model
                      </h2>
                      <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {availableModels.map((m) => (
                            <div
                              key={m}
                              onClick={() => handleModelSelect(m)}
                              className={`h-14 md:h-16 rounded-none border-2 cursor-pointer transition-all active:scale-95 flex items-center justify-center text-center group relative overflow-hidden ${
                                model === m ||
                                (m === "Other" && model === "Other")
                                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                                  : "border-[var(--color-grey-200)] bg-white text-black"
                              }`}
                            >
                              <span className="relative z-10 font-black text-xs md:text-sm uppercase tracking-widest">
                                {m}
                              </span>
                              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 skew-y-12 origin-bottom"></div>
                            </div>
                          ))}
                        </div>
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

                  <div className="pt-8 flex flex-col md:flex-row justify-between gap-4">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="w-full md:w-40 h-14 md:h-16 text-lg font-black uppercase tracking-[0.2em] rounded-none group relative overflow-hidden bg-white text-black border-2 border-black active:scale-95 transition-transform"
                    >
                      <div className="relative z-10 flex items-center justify-center gap-3">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />{" "}
                        Back
                      </div>
                      <div className="absolute inset-0 bg-black/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 skew-y-12 origin-bottom"></div>
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={
                        !brand || !model || (model === "Other" && !customModel)
                      }
                      className="w-full md:w-64 h-14 md:h-16 text-lg font-black uppercase tracking-[0.2em] rounded-none group relative overflow-hidden bg-[var(--color-grey-200)] text-black border-2 border-black active:scale-95 transition-transform"
                    >
                      <div className="relative z-10 flex items-center justify-center gap-3">
                        Next Step{" "}
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </div>
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 skew-y-12 origin-bottom"></div>
                    </Button>
                  </div>
                  <style
                    dangerouslySetInnerHTML={{
                      __html: `
                    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #000000; border-radius: 0px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #333333; }
                  `,
                    }}
                  />
                </div>
              )}

              {/* Step 4: Service Type */}
              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <h2 className="text-2xl font-bold uppercase">
                      Select Service
                    </h2>
                    <p className="text-[var(--color-grey-800)]">
                      Choose the best plan for your {vehicleType?.toLowerCase()}
                      .
                    </p>
                  </div>

                  {vehicleType === "Bike" && engineType !== "Electric" && (
                    <div className="bg-[var(--color-grey-100)] p-4 border-2 border-[var(--color-black)] mb-6">
                      <label className="block text-xs font-black uppercase tracking-widest mb-2">
                        Select Engine CC
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["0 - 150", "150 - 250", "250 - 400", "450 - 650"].map(
                          (cc) => (
                            <button
                              key={cc}
                              onClick={() => setBikeCC(cc)}
                              className={`p-2 text-xs font-bold border-2 transition-all ${
                                bikeCC === cc
                                  ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                                  : "bg-white border-[var(--color-grey-300)] hover:border-[var(--color-black)]"
                              }`}
                            >
                              {cc} CC
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {(vehicleType !== "Bike" ||
                    engineType === "Electric" ||
                    bikeCC) && (
                    <div className="space-y-4">
                      {(vehicleType === "Bike"
                        ? BIKE_SERVICES
                        : CAR_SERVICES
                      ).map((service, idx) => {
                        const isExpanded = expandedService === service.title;
                        const isSelected = serviceType === service.title;
                        const price = (service as any).prices
                          ? (service as any).prices[bikeCC || "0 - 150"]
                          : (service as any).price;

                        return (
                          <div
                            key={idx}
                            className={`border-2 transition-all overflow-hidden ${
                              isSelected
                                ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-opacity-20"
                                : "border-[var(--color-grey-200)]"
                            }`}
                          >
                            <div
                              onClick={() => {
                                setServiceType(service.title);
                                setExpandedService(
                                  isExpanded ? null : service.title,
                                );
                              }}
                              className="p-4 flex items-center justify-between cursor-pointer hover:bg-[var(--color-grey-50)]"
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`p-3 rounded-lg ${isSelected ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-grey-100)] text-[var(--color-grey-600)]"}`}
                                >
                                  {service.icon}
                                </div>
                                <div>
                                  <h3 className="font-black text-lg uppercase tracking-tight">
                                    {service.title}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xl font-black text-[var(--color-primary)]">
                                      ₹{price}
                                    </span>
                                    {service.duration && (
                                      <span className="text-[10px] font-bold text-[var(--color-grey-500)] flex items-center gap-1 uppercase">
                                        <Clock className="w-3 h-3" />{" "}
                                        {service.duration}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <ChevronDown
                                className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </div>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: "auto" }}
                                  exit={{ height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-4 pt-0 border-t border-[var(--color-grey-100)] bg-[var(--color-grey-50)]">
                                    <div className="py-4 space-y-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-xs font-black uppercase text-[var(--color-grey-500)] mb-2">
                                            Details
                                          </p>
                                          <p className="text-sm font-medium leading-relaxed">
                                            {service.description}
                                          </p>
                                          {service.interval && (
                                            <p className="text-xs font-bold text-[var(--color-primary)] mt-2 uppercase">
                                              {service.interval}
                                            </p>
                                          )}
                                        </div>
                                        {service.features && (
                                          <div>
                                            <p className="text-xs font-black uppercase text-[var(--color-grey-500)] mb-2">
                                              What's Included
                                            </p>
                                            <div className="grid grid-cols-1 gap-1">
                                              {service.features.map((f, i) => (
                                                <div
                                                  key={i}
                                                  className="flex items-start gap-2 text-xs font-medium"
                                                >
                                                  <Check className="w-3 h-3 mt-0.5 text-green-500 shrink-0" />
                                                  <span>{f}</span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <Button
                                        className="w-full h-14 md:h-16 text-lg font-black uppercase tracking-[0.2em] rounded-none group relative overflow-hidden bg-[var(--color-grey-200)] text-black border-2 border-black active:scale-95 transition-transform"
                                        disabled={
                                          vehicleType === "Bike" &&
                                          engineType !== "Electric" &&
                                          !bikeCC
                                        }
                                        onClick={() =>
                                          (window.location.href = "/checkout")
                                        }
                                      >
                                        <div className="relative z-10 flex items-center justify-center gap-3">
                                          Select & Checkout{" "}
                                          <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                        </div>
                                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 skew-y-12 origin-bottom"></div>
                                      </Button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="pt-8">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="w-full md:w-40 h-14 md:h-16 text-lg font-black uppercase tracking-[0.2em] rounded-none group relative overflow-hidden bg-white text-black border-2 border-black active:scale-95 transition-transform"
                    >
                      <div className="relative z-10 flex items-center justify-center gap-3">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />{" "}
                        Back
                      </div>
                      <div className="absolute inset-0 bg-black/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 skew-y-12 origin-bottom"></div>
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
                <CardTitle className="text-white text-2xl font-black tracking-widest uppercase">
                  Estimate
                </CardTitle>
                <CardDescription className="text-[var(--color-grey-300)] font-bold">
                  LIVE CALCULATION
                </CardDescription>
              </CardHeader>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-[var(--color-grey-200)] pb-3">
                  <span className="text-[var(--color-grey-600)] font-bold text-sm uppercase">
                    Vehicle
                  </span>
                  <span className="font-black text-right">
                    {vehicleType || "—"}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-[var(--color-grey-200)] pb-3">
                  <span className="text-[var(--color-grey-600)] font-bold text-sm uppercase">
                    Engine
                  </span>
                  <span className="font-black text-right">
                    {engineType || "—"}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-[var(--color-grey-200)] pb-3">
                  <span className="text-[var(--color-grey-600)] font-bold text-sm uppercase">
                    Brand
                  </span>
                  <span className="font-black text-right">{brand || "—"}</span>
                </div>

                <div className="flex justify-between items-center border-b border-[var(--color-grey-200)] pb-3">
                  <span className="text-[var(--color-grey-600)] font-bold text-sm uppercase">
                    Model
                  </span>
                  <span className="font-black text-right">
                    {model === "Other" && customModel
                      ? customModel
                      : model || "—"}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-[var(--color-grey-200)] pb-3">
                  <span className="text-[var(--color-grey-600)] font-bold text-sm uppercase">
                    Service
                  </span>
                  <span className="font-black text-right text-xs max-w-[150px]">
                    {serviceType || "—"}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2">
                  <span className="text-[var(--color-grey-600)] font-bold text-sm uppercase">
                    Date
                  </span>
                  <span className="font-black text-right">
                    {date
                      ? new Date(date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </span>
                </div>

                <div className="bg-[var(--color-grey-100)] p-4 rounded-lg mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black uppercase">
                      Cost Estimation
                    </span>
                    <span className="text-3xl font-black text-[var(--color-primary)]">
                      ₹{getEstimate()}
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--color-grey-600)] mt-2 font-bold uppercase text-center">
                    *Cost may vary additionally according to parts and work
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
