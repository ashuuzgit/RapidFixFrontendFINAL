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
      <section className="bg-[var(--color-black)] py-20 text-center">
        <div className="container mx-auto px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            PRECISION <span className="text-[var(--color-primary)]">DIALED.</span>
          </h1>
          <p className="text-[var(--color-grey-200)] max-w-2xl mx-auto">
            Get in touch with our engineering team. We're ready to elevate your vehicle's performance.
          </p>
        </div>
      </section>

      <section className="py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)] bg-[var(--color-grey-100)]">
        <div className="container mx-auto px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 bg-white rounded-lg shadow-xl overflow-hidden">
            
            {/* Sidebar */}
            <div className="bg-[var(--color-black)] text-white p-10 md:col-span-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-[var(--color-primary)] shrink-0" />
                    <p className="text-[var(--color-grey-300)]">123 Motorsport Way<br />Los Angeles, CA 90210</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="h-6 w-6 text-[var(--color-primary)] shrink-0" />
                    <p className="text-[var(--color-grey-300)]">1-800-RAPID-FIX</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="h-6 w-6 text-[var(--color-primary)] shrink-0" />
                    <p className="text-[var(--color-grey-300)]">support@rapidfix.com</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-success)]"></span>
                </span>
                <span className="text-sm font-medium text-[var(--color-grey-300)]">Currently accepting new projects</span>
              </div>
            </div>

            {/* Form */}
            <div className="p-10 md:col-span-2">
              <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
              
              {success ? (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-6 text-center">
                  <h4 className="text-xl font-bold mb-2">Message Received</h4>
                  <p>Our engineering team will review your inquiry and get back to you shortly.</p>
                  <Button className="mt-6" variant="outline" onClick={() => setSuccess(false)}>Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Name</label>
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        {...register("name", { required: true })} 
                        error={!!errors.name}
                      />
                      {errors.name && <span className="text-xs text-[var(--color-primary)]">Name is required</span>}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        {...register("email", { required: true, pattern: /^\S+@\S+$/i })} 
                        error={!!errors.email}
                      />
                      {errors.email && <span className="text-xs text-[var(--color-primary)]">Valid email is required</span>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <Input 
                      id="subject" 
                      placeholder="How can we help?" 
                      {...register("subject", { required: true })} 
                      error={!!errors.subject}
                    />
                    {errors.subject && <span className="text-xs text-[var(--color-primary)]">Subject is required</span>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us about your vehicle and goals..." 
                      {...register("message", { required: true })} 
                      error={!!errors.message}
                    />
                    {errors.message && <span className="text-xs text-[var(--color-primary)]">Message is required</span>}
                  </div>

                  <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
