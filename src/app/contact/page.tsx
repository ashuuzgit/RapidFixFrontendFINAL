"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import { Button } from "@antigravity/ui/Button"
import { Input } from "@antigravity/ui/Input"
import { Textarea } from "@antigravity/ui/Textarea"
import { submitContact } from "@/app/actions/contact"
import { MapPin, Mail, Phone, Loader2 } from "lucide-react"

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("subject", data.subject);
    formData.append("message", data.message);
    
    try {
      const response = await submitContact(formData);
      if (response.success) {
        setSuccess(true);
        reset();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-[var(--color-primary)] text-white border-b-2 border-black">
        <div className="container mx-auto px-4 md:px-8 py-24 md:py-32 text-center">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">
            PRECISION DIALED.
          </h1>
          <p className="text-xl md:text-2xl font-medium text-white/90 max-w-3xl mx-auto">
            Get in touch with our engineering team. We're ready to elevate your vehicle's performance.
          </p>
        </div>
      </section>

      {/* Grid Layout Form Section */}
      <section className="bg-white border-b-2 border-black">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">
          
          {/* Sidebar */}
          <div className="bg-[var(--color-grey-100)] text-black p-8 md:p-16 flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tight mb-8 text-black">Contact Information</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <MapPin className="h-8 w-8 text-[var(--color-primary)] shrink-0" />
                  <p className="text-lg font-medium text-black/80">Sector 120 Noida <br />Uttar Pradesh , India</p>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="h-8 w-8 text-[var(--color-primary)] shrink-0" />
                  <p className="text-lg font-medium text-black/80">96678 91434</p>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="h-8 w-8 text-[var(--color-primary)] shrink-0" />
                  <p className="text-lg font-medium text-black/80">support@rapidfix.com</p>
                </div>
              </div>
            </div>
            
            <div className="mt-16 flex items-center gap-4 p-4 border-2 border-black bg-white">
              <span className="relative flex h-4 w-4 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[var(--color-success)]"></span>
              </span>
              <span className="text-sm font-bold uppercase tracking-wider text-black">Currently accepting new projects</span>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 md:p-16 md:col-span-2">
            <h3 className="text-3xl font-black uppercase tracking-tight mb-8 text-black">Send us a message</h3>
            
            {success ? (
              <div className="bg-green-50 border-2 border-green-500 text-green-800 p-8">
                <h4 className="text-xl font-bold uppercase mb-2">Message Received</h4>
                <p className="font-medium">Our engineering team will review your inquiry and get back to you shortly.</p>
                <Button className="mt-8 border-2 border-black rounded-none shadow-none" variant="outline" onClick={() => setSuccess(false)}>Send Another Message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-black">Name</label>
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      className="border-2 border-black rounded-none shadow-none p-4"
                      {...register("name", { required: true })} 
                      error={!!errors.name}
                    />
                    {errors.name && <span className="text-xs font-bold text-[var(--color-primary)]">Name is required</span>}
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-black">Email</label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      className="border-2 border-black rounded-none shadow-none p-4"
                      {...register("email", { required: true, pattern: /^\S+@\S+$/i })} 
                      error={!!errors.email}
                    />
                    {errors.email && <span className="text-xs font-bold text-[var(--color-primary)]">Valid email is required</span>}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label htmlFor="subject" className="text-sm font-bold uppercase tracking-wider text-black">Subject</label>
                  <Input 
                    id="subject" 
                    placeholder="How can we help?" 
                    className="border-2 border-black rounded-none shadow-none p-4"
                    {...register("subject", { required: true })} 
                    error={!!errors.subject}
                  />
                  {errors.subject && <span className="text-xs font-bold text-[var(--color-primary)]">Subject is required</span>}
                </div>

                <div className="space-y-3">
                  <label htmlFor="message" className="text-sm font-bold uppercase tracking-wider text-black">Message</label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us about your vehicle and goals..." 
                    className="border-2 border-black rounded-none shadow-none p-4 min-h-[150px]"
                    {...register("message", { required: true })} 
                    error={!!errors.message}
                  />
                  {errors.message && <span className="text-xs font-bold text-[var(--color-primary)]">Message is required</span>}
                </div>

                <Button type="submit" className="w-full md:w-auto px-8 py-6 text-lg uppercase font-black tracking-wider border-2 border-transparent hover:border-black rounded-none" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
