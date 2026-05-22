import React from 'react';

interface LuxuryStampProps {
  className?: string;
  size?: number;
}

export default function LuxuryStamp({ className = "", size = 120 }: LuxuryStampProps) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      {/* Animated rotating border */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full animate-[spin_32s_linear_infinite]"
      >
        <path
          id="stampTextPath"
          d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
          fill="none"
        />
        <text className="text-[7.5px] uppercase tracking-[0.27em] fill-muted-foreground font-medium">
          <textPath href="#stampTextPath" startOffset="0%">
            Curated Spirits &bull; Luxury Delivery USA &bull; 21+ Age Verified &bull;
          </textPath>
        </text>
      </svg>

      {/* Center Seal */}
      <div className="absolute w-[68%] h-[68%] rounded-full border border-primary/20 bg-muted flex flex-col items-center justify-center text-center shadow-2xl">
        <svg
          viewBox="0 0 32 32"
          className="h-[38%] text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 2.5L25 6.5V14.5C25 20.5 20.5 26.5 16 29.5C11.5 26.5 7 20.5 7 14.5V6.5L16 2.5Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 14.5L14.5 17L20 11.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[6.5px] uppercase tracking-[0.3em] text-primary mt-1 font-semibold">
          NEXTSHOT
        </span>
        <span className="text-[4.5px] uppercase tracking-[0.1em] text-muted-foreground mt-0.5">
          EST. 2026
        </span>
      </div>
    </div>
  );
}
