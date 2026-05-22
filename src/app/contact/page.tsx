'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'allocations',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending concierge message
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Title Header */}
      <div className="text-center space-y-3 mb-16 max-w-2xl mx-auto">
        <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold">
          Concierge Support
        </span>
        <h1 className="text-3xl md:text-4xl text-editorial tracking-wide text-foreground">
          Establish Correspondence
        </h1>
        <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono leading-relaxed">
          Request private allocations, register corporate portfolios, or inquire about current transits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        
        {/* Left Side: Contact Information Cards */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="luxury-glass p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-primary font-mono border-b border-border/40 pb-3">
              Direct Channels
            </h3>

            <div className="space-y-4 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              {/* Phone */}
              <div className="flex items-center gap-3.5 hover:text-foreground duration-300">
                <div className="h-9 w-9 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-[8px] text-muted-foreground block font-semibold">Toll-Free Concierge</span>
                  <span className="text-foreground select-all">+1 (800) NEXT-SHOT</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3.5 hover:text-foreground duration-300">
                <div className="h-9 w-9 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-[8px] text-muted-foreground block font-semibold">Vault Inquiries</span>
                  <span className="text-foreground select-all">concierge@nextshot.com</span>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center gap-3.5 hover:text-foreground duration-300">
                <div className="h-9 w-9 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-[8px] text-muted-foreground block font-semibold">HQ Showroom Vault</span>
                  <span className="text-foreground">5th Ave, Manhattan, NY</span>
                </div>
              </div>
            </div>
          </div>

          <div className="luxury-glass p-6 text-[10px] text-muted-foreground font-mono uppercase tracking-widest leading-relaxed">
            <h4 className="text-foreground font-semibold mb-2">Portfolio Hours</h4>
            <p>Mon - Fri: 9:00 AM - 8:00 PM EST</p>
            <p>Sat - Sun: 10:00 AM - 5:00 PM EST</p>
            <p className="text-primary font-bold mt-3">24/7 Digital Vault access remains online.</p>
          </div>

        </div>

        {/* Right Side: Contact Form */}
        <div className="lg:col-span-3">
          <div className="luxury-glass p-8">
            
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="contact-form"
                  onSubmit={handleSubmit}
                  className="space-y-6 text-xs text-muted-foreground uppercase tracking-widest font-mono"
                >
                  
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] text-foreground font-bold">Collector Handle *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. John Astor"
                        className="w-full px-4 py-2.5 bg-muted/20 border border-border text-foreground focus:outline-none focus:border-primary transition"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-foreground font-bold">Email Coordinate *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="astor@example.com"
                        className="w-full px-4 py-2.5 bg-muted/20 border border-border text-foreground focus:outline-none focus:border-primary transition lowercase tracking-normal font-sans"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone & Inquiry Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] text-foreground font-bold">Telephone (Optional)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 019-2834"
                        className="w-full px-4 py-2.5 bg-muted/20 border border-border text-foreground focus:outline-none focus:border-primary transition font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-foreground font-bold">Inquiry Portfolio *</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-muted/20 border border-border text-foreground focus:outline-none focus:border-primary transition uppercase tracking-widest"
                      >
                        <option value="allocations" className="bg-black">Private Allocations</option>
                        <option value="corporate" className="bg-black">Corporate Reserves</option>
                        <option value="delivery" className="bg-black">Shipping & Transit</option>
                        <option value="general" className="bg-black">General Inquiries</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-foreground font-bold">Message Details *</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Specify rare bottle request dates, custom batch counts, or transit requests..."
                      rows={5}
                      className="w-full px-4 py-3 bg-muted/20 border border-border text-foreground focus:outline-none focus:border-primary transition tracking-normal font-sans"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-gold w-full py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>Simulating Dispatch...</>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Dispatch Request
                        </>
                      )}
                    </button>
                  </div>

                </motion.form>
              ) : (
                <motion.div 
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="h-12 w-12 bg-primary/20 border border-primary text-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg text-editorial text-foreground">Correspondence Received</h3>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono max-w-sm mx-auto leading-relaxed">
                    Thank you. A NextShot concierge agent has logged your request. We will review our vaults and contact you within 2 business hours.
                  </p>
                  <div className="pt-6">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="border border-border text-muted-foreground hover:text-foreground hover:border-foreground duration-300 px-6 py-2 text-[10px] uppercase tracking-widest font-mono"
                    >
                      Send Another Message
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>

    </div>
  );
}
