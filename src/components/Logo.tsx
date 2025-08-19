import * as React from "react";

// ==============================================================================
// File: src/components/Logo.tsx
// Updated to use a custom SVG logo to match the attached image.
// ==============================================================================
const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <svg width="68" height="48" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="text-[#a52a2a] w-12 h-12">
        <path fill="currentColor" d="M100 190c-49.69 0-90-40.31-90-90s40.31-90 90-90 90 40.31 90 90-40.31 90-90 90zM100 20c-44.11 0-80 35.89-80 80s35.89 80 80 80 80-35.89 80-80-35.89-80-80-80z"/>
        <path fill="none" stroke="currentColor" strokeWidth="15" d="M100 160c-33.14 0-60-26.86-60-60s26.86-60 60-60 60 26.86 60 60-26.86 60-60 60z"/>
        <line x1="120" y1="80" x2="80" y2="120" stroke="currentColor" strokeWidth="10"/>
        <line x1="80" y1="80" x2="120" y2="120" stroke="currentColor" strokeWidth="10"/>
        <path fill="none" stroke="currentColor" strokeWidth="5" d="M30 100h15l15-30m100 30h-15l-15-30M100 170v-10M100 30v10"/>
        <text x="35" y="105" fontFamily="sans-serif" fontSize="24" fontWeight="bold" fill="currentColor">19</text>
        <text x="145" y="105" fontFamily="sans-serif" fontSize="24" fontWeight="bold" fill="currentColor">81</text>
      </svg>
      <span className="text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
        Nega Buchary
      </span>
    </div>
  );
};
