import React from 'react';

export default function DiamondBackground() {
  return (
    <div className="diamond-background">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="diamond-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="40" height="40" fill="#9B3D9B" transform="rotate(45 20 20)" />
            <rect x="40" y="0" width="40" height="40" fill="#8B7355" transform="rotate(45 60 20)" />
            <rect x="0" y="40" width="40" height="40" fill="#8B7355" transform="rotate(45 20 60)" />
            <rect x="40" y="40" width="40" height="40" fill="#9B3D9B" transform="rotate(45 60 60)" />
            <g transform="translate(60, 20) scale(0.15)">
              <path d="M50 10c-15 0-25 10-25 25 0 8 4 15 10 20l-5 15h10l5-10 5 10h10l-5-15c6-5 10-12 10-20 0-15-10-25-25-25zm-10 30c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5zm20 0c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5z" fill="#4A4A4A" opacity="0.6"/>
            </g>
            <g transform="translate(20, 60) scale(0.15)">
              <path d="M50 10c-15 0-25 10-25 25 0 8 4 15 10 20l-5 15h10l5-10 5 10h10l-5-15c6-5 10-12 10-20 0-15-10-25-25-25zm-10 30c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5zm20 0c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5z" fill="#4A4A4A" opacity="0.6"/>
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diamond-pattern)" />
      </svg>
    </div>
  );
}
