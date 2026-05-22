import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export default function Logo({ className = "h-8", showTagline = false }: LogoProps) {
  return (
    <div className="flex flex-col items-start select-none">
      <div className="flex items-center gap-2">
        {/* Cinematic Gold Glass Icon */}
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className={`${className} aspect-square text-primary animate-pulse-slow`}
        >
          {/* Outer diamond frame */}
          <path 
            d="M50 5L95 50L50 95L5 50L50 5Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Inner luxury liquor glass outline */}
          <path 
            d="M32 30H68V42C68 52 60 60 50 60C40 60 32 52 32 42V30Z" 
            stroke="currentColor" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Liquors fill level */}
          <path 
            d="M36 38H64V42C64 47 60 51 50 51C40 51 36 47 36 42V38Z" 
            fill="url(#goldGrad)" 
            opacity="0.85"
          />
          {/* Glass stem & base */}
          <path 
            d="M50 60V82" 
            stroke="currentColor" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
          <path 
            d="M35 82H65" 
            stroke="currentColor" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
          {/* Sparkle */}
          <circle cx="68" cy="28" r="3" fill="#FFF" />
          
          <defs>
            <linearGradient id="goldGrad" x1="36" y1="38" x2="64" y2="51" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F4ECCE" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#E5C158" />
            </linearGradient>
          </defs>
        </svg>

        <span className="text-xl tracking-[0.22em] font-light uppercase text-foreground">
          Next<span className="font-semibold gold-text-gradient">Shot</span>
        </span>
      </div>
      {showTagline && (
        <span className="text-[7.5px] uppercase tracking-[0.45em] text-muted-foreground mt-1 ml-0.5">
          Curated Spirits &bull; Unrivaled Speed
        </span>
      )}
    </div>
  );
}
