import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-muted-foreground font-sans">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-16 border-b border-border/40 pb-8">
        <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-mono font-bold block">
          Data Protection
        </span>
        <h1 className="text-3xl text-editorial tracking-wide text-foreground">
          Privacy Policy
        </h1>
        <p className="text-[10px] uppercase tracking-widest font-mono">
          Last Updated: May 22, 2026
        </p>
      </div>

      {/* Main legal content */}
      <div className="space-y-8 text-sm leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-foreground font-mono flex items-center gap-2">
            <span className="text-primary font-mono">01.</span> Information Collection
          </h2>
          <p>
            NextShot collects personal identification data required to process orders, verify legal drinking age, and manage transactions. This includes name, date of birth, physical delivery coordinates, email address, and phone numbers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-foreground font-mono flex items-center gap-2">
            <span className="text-primary font-mono">02.</span> Payment Verification & Stripe
          </h2>
          <p>
            NextShot does not store or log financial details. All checkout payment transactions are redirected and processed by Stripe (payment gateway). Stripe collects card details, billing addresses, and payment tokens under their secure privacy frameworks.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-foreground font-mono flex items-center gap-2">
            <span className="text-primary font-mono">03.</span> Authentication & Clerk
          </h2>
          <p>
            Collector authentication is handled securely by Clerk. Clerk records signup emails, session security tokens, avatars, and profile logs. We synchronize this information with our Mongoose databases via Webhook listeners (`/api/auth/webhook`).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-foreground font-mono flex items-center gap-2">
            <span className="text-primary font-mono">04.</span> Age Gate & Local Storage
          </h2>
          <p>
            To optimize user experience and comply with regulations, we store your age verification status in your browser's local storage and cookie cache. This prevents the age gate from repeatedly loading on every transition. Birthdates are not utilized for advertising.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-foreground font-mono flex items-center gap-2">
            <span className="text-primary font-mono">05.</span> Sharing of Information
          </h2>
          <p>
            We do not sell, trade, or rent personal data to third parties. We share limited delivery information with our licensed courier partners and verification databases to check age requirements and fulfill physical logistics.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-foreground font-mono flex items-center gap-2">
            <span className="text-primary font-mono">06.</span> Security Safeguards
          </h2>
          <p>
            We utilize robust industry-standard SSL encryption and secure endpoint routing keys to safeguard data transiting between users and our MongoDB servers. However, no digital storage is 100% impenetrable. If a database event occurs, we will notify affected parties immediately.
          </p>
        </section>

      </div>

    </div>
  );
}
