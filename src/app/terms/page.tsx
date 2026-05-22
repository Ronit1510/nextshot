import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-muted-foreground font-sans">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-16 border-b border-border/40 pb-8">
        <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-mono font-bold block">
          Legal Agreement
        </span>
        <h1 className="text-3xl text-editorial tracking-wide text-foreground">
          Terms of Service
        </h1>
        <p className="text-[10px] uppercase tracking-widest font-mono">
          Last Updated: May 22, 2026
        </p>
      </div>

      {/* Main legal content */}
      <div className="space-y-8 text-sm leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-foreground font-mono flex items-center gap-2">
            <span className="text-primary font-mono">01.</span> Acceptance of Terms
          </h2>
          <p>
            Welcome to NextShot. By accessing or using our website, services, or purchasing products from our digital spirits vault, you agree to be bound by these Terms of Service. If you do not agree to all terms, you must immediately terminate access to our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-foreground font-mono flex items-center gap-2">
            <span className="text-primary font-mono">02.</span> Age Requirement (21+)
          </h2>
          <p>
            You must be at least twenty-one (21) years of age to access our website, view collections, create an account, purchase products, or receive deliveries. By using this website, you certify under penalty of perjury that you are 21 years of age or older. We employ third-party age verification databases to verify registration data.
          </p>
          <p className="border-l-2 border-primary/40 pl-4 py-1 text-xs uppercase tracking-wider font-mono text-primary font-semibold">
            WARNING: It is a violation of federal and state law to purchase or attempt to purchase alcohol if you are under the age of 21, or to purchase alcohol for someone else who is under age.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-foreground font-mono flex items-center gap-2">
            <span className="text-primary font-mono">03.</span> Shipping compliance & Signatures
          </h2>
          <p>
            All deliveries of alcoholic products must be signed for by an adult (21+) presenting a valid government-issued ID upon arrival. Carrier agents are instructed to check identification and refuse delivery if the recipient is underage, intoxicated, or fails to present ID.
          </p>
          <p>
            Title to, and ownership of, all products passes from NextShot to the buyer at the time of purchase in our licensed warehouse state. The buyer authorizes NextShot to select a common carrier to manage delivery on their behalf.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-foreground font-mono flex items-center gap-2">
            <span className="text-primary font-mono">04.</span> Account Registration
          </h2>
          <p>
            Registration is required to access your user dashboard, check order status, accumulate loyalty rewards, and save shipping coordinates. You are solely responsible for protecting your account credentials. All transactions executed under your credentials will be deemed authorized by you.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-foreground font-mono flex items-center gap-2">
            <span className="text-primary font-mono">05.</span> Finality of Sales
          </h2>
          <p>
            Due to strict state regulations, returns or exchanges of alcoholic beverages are generally prohibited. In the event of transit breakage or packaging defects, clients must notify our support concierge within 48 hours of receipt. Returns will be examined, and eligible refunds will be processed to the original payment method.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-foreground font-mono flex items-center gap-2">
            <span className="text-primary font-mono">06.</span> Intellectual Property
          </h2>
          <p>
            All logos, SVGs, custom typography, images, text, and design elements are the intellectual property of NextShot. Unauthorized copying, crawling, or republication of our assets is strictly prohibited.
          </p>
        </section>

      </div>

    </div>
  );
}
