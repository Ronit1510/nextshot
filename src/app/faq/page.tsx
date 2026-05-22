'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFAQ = (catIdx: number, itemIdx: number) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenIndex(prev => (prev === key ? null : key));
  };

  const faqCategories: FAQCategory[] = [
    {
      title: 'Compliance & Delivery Regulations',
      items: [
        {
          question: 'Are there age restrictions for delivery?',
          answer: 'Yes, absolutely. By federal and state regulations, all shipments of alcoholic beverages require an adult signature upon delivery. The signing recipient must present a valid government-issued photo ID showing proof they are 21 years of age or older. We cannot bypass this requirement under any circumstances.'
        },
        {
          question: 'Which states does NextShot ship to?',
          answer: 'NextShot is compliant with direct-to-consumer liquor shipping laws. Currently, we ship to CA, FL, NY, TX, IL, WA, and DC. Delivery rules vary by state and local dry jurisdictions. If you attempt to checkout to a restricted zip code, our system will notify you immediately.'
        },
        {
          question: 'Can you deliver to PO Boxes or military addresses?',
          answer: 'No. Due to strict signature requirements and federal guidelines, we cannot deliver alcoholic shipments to PO Boxes, APO, FPO, or DPO postal locations.'
        }
      ]
    },
    {
      title: 'Rare Bottles & Allocated Reserves',
      items: [
        {
          question: 'How do you source your allocated spirits?',
          answer: 'Our private catalog is acquired through direct distillery allocations, trusted licensed importers, and certified collector liquidations. Every single bottle is verified for authenticity, label condition, and proper fill level prior to vault entry.'
        },
        {
          question: 'Can I request a bottle not listed in the store?',
          answer: 'Yes. Our NextShot Concierge team specializes in finding rare, ultra-premium, and historical spirits. Please use our Contact Page to submit a concierge request, and our acquisition specialists will search our private network of collectors.'
        },
        {
          question: 'Do you offer temperature-controlled shipping?',
          answer: 'Yes. All high-end reserves (wines, rare cognacs, historical whiskeys) are packed in insulated containers with temperature-stabilizing packs to ensure the flavor profiles and aging characteristics are preserved during transit.'
        }
      ]
    },
    {
      title: 'Orders, Payments & Returns',
      items: [
        {
          question: 'What is the return policy for spirits?',
          answer: 'Under state and federal law, retail sales of alcoholic beverages are final. However, if a bottle arrives damaged, cork-spoiled, or leaking during transit, please contact our concierge service within 48 hours of signature receipt with photographic proof. We will coordinate a courier return and immediate replacement or refund.'
        },
        {
          question: 'How does the Loyalty Points program work?',
          answer: 'Registered collectors earn 1 loyalty point for every dollar spent on purchases. Points can be redeemed at checkout for allocations credits (e.g. 100 points = $5.00 credit) or used to unlock exclusive access to allocated, member-only drops.'
        },
        {
          question: 'How do I use a coupon code?',
          answer: 'If you have an active luxury coupon code (e.g., LUXURY20), you can enter it in the cart page promo field. The system will automatically validate minimum purchase values, apply the discount, and display updated pricing before checkout.'
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Page Header */}
      <div className="text-center space-y-3 mb-16">
        <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold">
          Knowledge Base
        </span>
        <h1 className="text-3xl md:text-4xl text-editorial tracking-wide text-foreground">
          Frequently Inquired
        </h1>
        <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono leading-relaxed max-w-lg mx-auto">
          Understand the shipping regulations, authenticity controls, and concierge mechanisms behind NextShot.
        </p>
      </div>

      {/* Accordions */}
      <div className="space-y-12">
        {faqCategories.map((category, catIdx) => (
          <div key={catIdx} className="space-y-4">
            
            {/* Category Subtitle */}
            <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-primary font-mono border-b border-border/40 pb-2.5">
              {category.title}
            </h2>

            {/* Questions Grid */}
            <div className="divide-y divide-border/30 border border-border/40 bg-muted/5">
              {category.items.map((item, itemIdx) => {
                const key = `${catIdx}-${itemIdx}`;
                const isOpen = openIndex === key;
                
                return (
                  <div key={itemIdx} className="overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(catIdx, itemIdx)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left text-xs uppercase tracking-wider text-foreground hover:bg-muted/10 duration-200 font-mono"
                    >
                      <span className="flex items-center gap-2.5">
                        <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                        {item.question}
                      </span>
                      <span>
                        {isOpen ? (
                          <Minus className="h-4.5 w-4.5 text-primary" />
                        ) : (
                          <Plus className="h-4.5 w-4.5 text-muted-foreground" />
                        )}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden bg-muted/5 border-t border-border/30"
                        >
                          <p className="p-5 text-xs text-muted-foreground font-sans leading-relaxed tracking-normal lowercase first-letter:uppercase">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
