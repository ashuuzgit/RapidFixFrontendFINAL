"use client";

import { useState, useEffect } from "react";
import { useBookingStore } from "@/store/useBookingStore";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Calendar } from "@/components/ui/calendar-rac";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Home,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Wrench,
  CreditCard,
  Banknote,
  UserPlus,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function CheckoutPage() {
  const {
    vehicleType,
    engineType,
    brand,
    model,
    bikeCC,
    serviceType,
    date,
    getEstimate,
    location,
    setLocation,
    address,
    setAddress,
    contact,
    setContact,
    problem,
    setProblem,
    paymentMethod,
    setPaymentMethod,
    setDate,
    reset,
  } = useBookingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [welcomeName, setWelcomeName] = useState("");
  const [name, setName] = useState("");
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Lookup: replaces OTP send + verify ────────────────────────────────────
  const handleLookup = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!emailRegex.test(contact) && !phoneRegex.test(contact)) {
      alert("Please enter a valid phone number (10 digits) or email address.");
      return;
    }

    setIsLookingUp(true);
    try {
      const res = await fetch(
        `${API_URL}/public/lookup?contact=${encodeURIComponent(contact)}`,
      );
      const data = await res.json();

      if (data.found) {
        setCustomerId(data.customerId);
        setWelcomeName(data.name);
        setIsNewCustomer(false);
      } else {
        setCustomerId(null);
        setIsNewCustomer(true);
      }
      setIsVerified(true);
    } catch (e) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLookingUp(false);
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!isVerified) {
      alert("Please verify your contact details first.");
      return;
    }
    if (isNewCustomer && !name.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (!vehicleType || !brand || !model || !serviceType || !date) {
      alert(
        "Missing booking information. Please go back and complete the steps.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/public/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact,
          customerId,
          name: isNewCustomer ? name.trim() : welcomeName,
          vehicleType,
          engineType: engineType || undefined,
          bikeCC:
            vehicleType === "Bike" && engineType !== "Electric"
              ? bikeCC || undefined
              : undefined,
          brand,
          model,
          serviceType,
          date,
          estimate: getEstimate(),
          location,
          address,
          problem,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      if (data.success) {
        setBookingId(data.bookingId);
        setSuccess(true);
      }
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="w-full min-h-screen bg-[var(--color-grey-100)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center bg-[var(--color-grey-100)] p-4">
        <Card className="max-w-md w-full p-8 text-center border-none shadow-2xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--color-success)]">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black uppercase mb-2">Order Placed!</h2>
          <p className="text-[var(--color-grey-800)] mb-6">
            Your service for {brand} {model} has been scheduled successfully.
          </p>
          <div className="bg-[var(--color-grey-100)] p-4 rounded-md mb-8">
            <p className="text-[10px] font-bold text-[var(--color-grey-500)] mb-1 uppercase tracking-widest">
              Booking ID
            </p>
            <p className="text-xl font-mono font-black">{bookingId}</p>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              reset();
              window.location.href = "/";
            }}
          >
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[var(--color-grey-100)] py-12 relative overflow-hidden">
      {/* Background Edge: Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-black) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      ></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="mb-12">
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent text-[var(--color-grey-600)] font-bold uppercase text-[10px] tracking-widest mb-4"
            onClick={() => (window.location.href = "/booking")}
          >
            <ArrowLeft className="mr-2 h-3 w-3" /> Back to Booking
          </Button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                Finalize <br />
                <span className="text-[var(--color-primary)]">Booking</span>
              </h1>
              <p className="text-[var(--color-grey-600)] font-bold uppercase text-xs tracking-[0.3em] mt-4">
                Precision Service Engineering
              </p>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-[10px] font-black uppercase text-[var(--color-grey-400)] tracking-widest mb-1">
                Current Estimate
              </div>
              <div className="text-4xl font-black">₹{getEstimate()}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Location & Address */}
            <Card className="border-2 border-[var(--color-black)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden bg-white">
              <div className="bg-[var(--color-black)] p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                  <h2 className="font-black uppercase tracking-[0.2em] text-sm">
                    Service Location
                  </h2>
                </div>
                <div className="text-[10px] font-bold text-[var(--color-grey-400)] uppercase">
                  Step 01
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-[var(--color-grey-500)] mb-2 block tracking-widest">
                    Select Location / City
                  </label>
                  <Input
                    placeholder="Enter your city/locality"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border-2 border-[var(--color-grey-200)] focus:border-[var(--color-black)] rounded-none h-12 font-bold"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <label className="text-[10px] font-black uppercase text-[var(--color-grey-500)] mb-2 block tracking-widest">
                      Flat / House No.
                    </label>
                    <Input
                      placeholder="e.g. 402, Sunshine"
                      value={address.flat}
                      onChange={(e) => setAddress({ flat: e.target.value })}
                      className="border-2 border-[var(--color-grey-200)] focus:border-[var(--color-black)] rounded-none h-12 font-bold"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-[10px] font-black uppercase text-[var(--color-grey-500)] mb-2 block tracking-widest">
                      Area / Colony
                    </label>
                    <Input
                      placeholder="e.g. Greater Kailash"
                      value={address.area}
                      onChange={(e) => setAddress({ area: e.target.value })}
                      className="border-2 border-[var(--color-grey-200)] focus:border-[var(--color-black)] rounded-none h-12 font-bold"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-[10px] font-black uppercase text-[var(--color-grey-500)] mb-2 block tracking-widest">
                      Pincode
                    </label>
                    <Input
                      placeholder="e.g. 110048"
                      value={address.landmark}
                      onChange={(e) => setAddress({ landmark: e.target.value })}
                      className="border-2 border-[var(--color-grey-200)] focus:border-[var(--color-black)] rounded-none h-12 font-bold"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Verification */}
            <Card className="border-2 border-[var(--color-black)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden bg-white">
              <div className="bg-[var(--color-black)] p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                  <h2 className="font-black uppercase tracking-[0.2em] text-sm">
                    Contact Details
                  </h2>
                </div>
                <div className="text-[10px] font-bold text-[var(--color-grey-400)] uppercase">
                  Step 02
                </div>
              </div>
              <div className="p-8">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-black uppercase text-[var(--color-grey-500)] mb-2 block tracking-widest">
                      Phone Number or Email
                    </label>
                    <div className="flex gap-3">
                      <Input
                        placeholder="Enter phone or email"
                        value={contact}
                        onChange={(e) => {
                          setContact(e.target.value);
                          // reset lookup state if contact changes
                          if (isVerified) {
                            setIsVerified(false);
                            setIsNewCustomer(false);
                            setCustomerId(null);
                            setWelcomeName("");
                          }
                        }}
                        disabled={isVerified}
                        className={`border-2 h-12 font-bold rounded-none flex-1 ${
                          isVerified
                            ? isNewCustomer
                              ? "bg-blue-50 border-blue-200"
                              : "bg-green-50 border-green-200"
                            : "border-[var(--color-grey-200)] focus:border-[var(--color-black)]"
                        }`}
                      />
                      {!isVerified && (
                        <Button
                          onClick={handleLookup}
                          disabled={!contact || isLookingUp}
                          className="shrink-0 h-12 rounded-none px-8 font-black uppercase tracking-widest"
                        >
                          {isLookingUp ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Verify"
                          )}
                        </Button>
                      )}
                      {isVerified && !isNewCustomer && (
                        <div className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase px-4 border-2 border-green-200 bg-green-50 shrink-0">
                          <CheckCircle2 className="w-4 h-4" /> Welcome,{" "}
                          {welcomeName}
                        </div>
                      )}
                      {isVerified && isNewCustomer && (
                        <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase px-4 border-2 border-blue-200 bg-blue-50 shrink-0">
                          <UserPlus className="w-4 h-4" /> New Customer
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name input — only for new customers */}
                <AnimatePresence>
                  {isVerified && isNewCustomer && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-6 pt-6 border-t-2 border-dashed border-[var(--color-grey-200)]"
                    >
                      <label className="text-[10px] font-black uppercase text-[var(--color-grey-500)] mb-3 block tracking-widest">
                        Your Full Name
                      </label>
                      <Input
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border-2 border-[var(--color-black)] rounded-none h-12 font-bold w-full max-w-xs"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>

            {/* Date & Problem */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-2 border-[var(--color-black)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden bg-white">
                <div className="bg-[var(--color-black)] p-5 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-[var(--color-primary)]" />
                    <h2 className="font-black uppercase tracking-[0.2em] text-sm">
                      Service Date
                    </h2>
                  </div>
                  <div className="text-[10px] font-bold text-[var(--color-grey-400)] uppercase">
                    Step 03
                  </div>
                </div>
                <div className="p-8 flex justify-center">
                  <Calendar
                    value={date ? parseDate(date) : null}
                    onChange={(v) => setDate(v.toString())}
                    minValue={today(getLocalTimeZone())}
                    className="border-none shadow-none scale-110"
                  />
                </div>
              </Card>

              <Card className="border-2 border-[var(--color-black)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden bg-white">
                <div className="bg-[var(--color-black)] p-5 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-[var(--color-primary)]" />
                    <h2 className="font-black uppercase tracking-[0.2em] text-sm">
                      Issue Description
                    </h2>
                  </div>
                  <div className="text-[10px] font-bold text-[var(--color-grey-400)] uppercase">
                    Optional
                  </div>
                </div>
                <div className="p-8 h-full flex flex-col">
                  <label className="text-[10px] font-black uppercase text-[var(--color-grey-500)] mb-2 block tracking-widest">
                    Technical details
                  </label>
                  <Textarea
                    placeholder="Describe the issue with your vehicle..."
                    className="flex-1 border-2 border-[var(--color-grey-200)] focus:border-[var(--color-black)] rounded-none min-h-[180px] font-bold p-4"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                  />
                </div>
              </Card>
            </div>

            {/* Payment Method */}
            <Card className="border-2 border-[var(--color-black)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden bg-white">
              <div className="bg-[var(--color-black)] p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[var(--color-primary)]" />
                  <h2 className="font-black uppercase tracking-[0.2em] text-sm">
                    Payment Method
                  </h2>
                </div>
                <div className="text-[10px] font-bold text-[var(--color-grey-400)] uppercase">
                  Step 04
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentMethod("now")}
                    className={`p-6 border-2 cursor-pointer transition-all flex flex-col gap-3 group relative overflow-hidden ${
                      paymentMethod === "now"
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-[var(--color-grey-200)] hover:border-[var(--color-black)] bg-white text-black"
                    }`}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <CreditCard
                        className={`w-8 h-8 ${paymentMethod === "now" ? "text-white" : "text-[var(--color-primary)]"}`}
                      />
                      {paymentMethod === "now" && (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="relative z-10">
                      <h3 className="font-black uppercase tracking-wider text-lg">
                        Pay Now
                      </h3>
                      <p
                        className={`text-[10px] font-bold uppercase tracking-widest ${paymentMethod === "now" ? "text-white/80" : "text-[var(--color-grey-500)]"}`}
                      >
                        Online Payment
                      </p>
                    </div>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 skew-y-12 origin-bottom"></div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("later")}
                    className={`p-6 border-2 cursor-pointer transition-all flex flex-col gap-3 group relative overflow-hidden ${
                      paymentMethod === "later"
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-[var(--color-grey-200)] hover:border-[var(--color-black)] bg-white text-black"
                    }`}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <Banknote
                        className={`w-8 h-8 ${paymentMethod === "later" ? "text-white" : "text-[var(--color-primary)]"}`}
                      />
                      {paymentMethod === "later" && (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="relative z-10">
                      <h3 className="font-black uppercase tracking-wider text-lg">
                        Pay Later
                      </h3>
                      <p
                        className={`text-[10px] font-bold uppercase tracking-widest ${paymentMethod === "later" ? "text-white/80" : "text-[var(--color-grey-500)]"}`}
                      >
                        After Service
                      </p>
                    </div>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 skew-y-12 origin-bottom"></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <Card className="border-4 border-[var(--color-black)] shadow-[12px_12px_0px_0px_rgba(179,45,15,0.3)] rounded-none bg-white overflow-hidden">
                <div className="bg-[var(--color-black)] p-8 text-white relative">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Wrench className="w-24 h-24 rotate-45" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">
                    Order <br />
                    Summary
                  </h3>
                  <p className="text-[var(--color-grey-400)] text-[10px] font-bold uppercase tracking-[0.3em] mt-4">
                    Precision Engineering Report
                  </p>
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start border-b-2 border-[var(--color-grey-100)] pb-4">
                    <span className="text-[10px] font-black uppercase text-[var(--color-grey-500)] tracking-widest">
                      Vehicle Spec
                    </span>
                    <div className="text-right">
                      <span className="font-black uppercase text-sm leading-tight block">
                        {brand} {model}
                      </span>
                      <span className="text-[10px] font-bold text-[var(--color-grey-500)] uppercase block mt-1">
                        {engineType}{" "}
                        {vehicleType === "Bike" && engineType !== "Electric"
                          ? `• ${bikeCC} CC`
                          : vehicleType === "Car"
                            ? "• Car"
                            : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-start border-b-2 border-[var(--color-grey-100)] pb-4">
                    <span className="text-[10px] font-black uppercase text-[var(--color-grey-500)] tracking-widest">
                      Selected Service
                    </span>
                    <span className="font-black uppercase text-xs text-right max-w-[150px] leading-tight">
                      {serviceType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b-2 border-[var(--color-grey-100)] pb-4">
                    <span className="text-[10px] font-black uppercase text-[var(--color-grey-500)] tracking-widest">
                      Selected Date
                    </span>
                    <span className="font-black uppercase text-sm">
                      {date
                        ? new Date(date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>
                  <div className="pt-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-[10px] font-black uppercase text-[var(--color-primary)] tracking-widest block mb-1">
                          *Estimate
                        </span>
                        <span className="text-5xl font-black leading-none">
                          ₹{getEstimate()}
                        </span>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-red-50 border-2 border-red-100">
                      <p className="text-[9px] font-bold text-red-800 uppercase leading-relaxed tracking-wider">
                        *Cost reflects standard labor and basic consumables.
                        Component replacements may incur additional charges.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Button
                className="w-full h-20 text-xl font-black uppercase tracking-[0.2em] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none group relative overflow-hidden"
                disabled={
                  isSubmitting ||
                  !isVerified ||
                  (isNewCustomer && !name.trim()) ||
                  !location ||
                  !address.flat ||
                  !date ||
                  !paymentMethod
                }
                onClick={handleSubmit}
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" /> Confirming
                      Booking...
                    </>
                  ) : (
                    <>
                      Confirm Booking{" "}
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </div>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform skew-y-12 origin-bottom"></div>
              </Button>

              {!isVerified && (
                <div className="flex items-start gap-3 p-5 bg-amber-50 border-2 border-amber-300 rounded-none shadow-[4px_4px_0px_0px_rgba(217,119,6,0.2)]">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-black text-amber-900 uppercase leading-relaxed tracking-widest">
                    Security protocol active. Please complete phone/email
                    verification to initialize booking.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
