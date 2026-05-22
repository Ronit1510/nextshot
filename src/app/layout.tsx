import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import Navbar from '@/components/common/navbar';
import Footer from '@/components/common/footer';
import AgeGate from '@/components/common/age-gate';

export const metadata: Metadata = {
  title: {
    default: 'NextShot | Premium USA Liquor Delivery & Luxury Alcohol Cellar',
    template: '%s | NextShot'
  },
  description: 'Buy whiskey online & get premium liquor delivery in the USA. NextShot is a highly curated luxury spirits cellar, offering rare bourbon, scotch, champagne, and wines delivered with unprecedented concierge speed.',
  keywords: [
    'Premium liquor delivery USA',
    'Buy whiskey online',
    'Luxury alcohol store',
    'Wine delivery',
    'Online liquor shop',
    'Premium spirits delivery',
    'Buy vodka online',
    'Alcohol ecommerce USA',
    'Rare bourbon allocation',
    'Champagne fast shipping'
  ],
  authors: [{ name: 'NextShot Concierge' }],
  metadataBase: new URL('https://nextshot.vercel.app'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'NextShot | Premium USA Liquor Delivery & Luxury Spirits',
    description: 'Explore our curated liquor vault. Order rare bourbon, single malts, and fine vintages. Direct-to-door concierge shipping.',
    url: 'https://nextshot.vercel.app',
    siteName: 'NextShot',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://nextshot.vercel.app/og-luxury.jpg',
        width: 1200,
        height: 630,
        alt: 'NextShot Vault - Rare Spirits'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NextShot | Luxury Liquor Delivery USA',
    description: 'Curated liquor expressions delivered with concierge speed. The digital cabinet for serious spirits collectors.',
    images: ['https://nextshot.vercel.app/og-luxury.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#D4AF37',
          colorBackground: '#121214',
          colorText: '#F9F9FB',
          colorTextSecondary: '#A0A0AB',
          colorDanger: '#EF4444',
        },
        elements: {
          card: 'border border-primary/10 shadow-2xl bg-muted rounded-none',
          socialButtonsBlockButton: 'border border-border/80 text-foreground hover:bg-muted-foreground/10 duration-300 rounded-none',
          formButtonPrimary: 'bg-primary text-background hover:bg-accent duration-300 rounded-none uppercase text-xs tracking-widest py-3',
          headerTitle: 'text-foreground font-serif tracking-wide',
          headerSubtitle: 'text-muted-foreground uppercase text-[10px] tracking-widest',
          footerActionLink: 'text-primary hover:text-accent font-semibold',
          formFieldLabel: 'text-[9px] uppercase tracking-wider text-muted-foreground',
          formFieldInput: 'bg-muted border border-border/80 rounded-none text-foreground text-sm focus:border-primary',
        }
      }}
    >
      <html lang="en" className="h-full">
        <body className="font-sans antialiased bg-background text-foreground min-h-full flex flex-col selection:bg-primary/20 selection:text-primary">
          {/* Translucent Navbar */}
          <Navbar />
          
          {/* Main Context with Top Padding to clear Navbar */}
          <main className="flex-grow pt-[84px]">
            {children}
          </main>
          
          {/* Cinematic age gate verification block */}
          <AgeGate />
          
          {/* Premium Footer */}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
