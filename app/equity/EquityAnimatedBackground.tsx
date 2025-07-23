import React from "react";

export default function EquityAnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" fill="none" className="absolute inset-0 w-full h-full">
        {/* Animated purple/blue waves */}
        <path>
          <animate attributeName="d" dur="8s" repeatCount="indefinite"
            values="M0,600 Q480,500 960,600 T1920,600;M0,620 Q480,700 960,620 T1920,620;M0,600 Q480,500 960,600 T1920,600" />
        </path>
        <path d="M0,700 Q480,800 960,700 T1920,700" stroke="#a78bfa" strokeWidth="3" fill="none" opacity="0.15">
          <animate attributeName="d" dur="10s" repeatCount="indefinite"
            values="M0,700 Q480,800 960,700 T1920,700;M0,720 Q480,600 960,720 T1920,720;M0,700 Q480,800 960,700 T1920,700" />
        </path>
        <path d="M0,800 Q480,900 960,800 T1920,800" stroke="#60a5fa" strokeWidth="2" fill="none" opacity="0.12">
          <animate attributeName="d" dur="12s" repeatCount="indefinite"
            values="M0,800 Q480,900 960,800 T1920,800;M0,820 Q480,700 960,820 T1920,820;M0,800 Q480,900 960,800 T1920,800" />
        </path>
        {/* Extra animated waves for more motion */}
        <path d="M0,900 Q600,1000 1200,900 T1920,900" stroke="#a78bfa" strokeWidth="1.5" fill="none" opacity="0.09">
          <animate attributeName="d" dur="14s" repeatCount="indefinite"
            values="M0,900 Q600,1000 1200,900 T1920,900;M0,920 Q600,800 1200,920 T1920,920;M0,900 Q600,1000 1200,900 T1920,900" />
        </path>
        <path d="M0,500 Q700,400 1400,500 T1920,500" stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.09">
          <animate attributeName="d" dur="16s" repeatCount="indefinite"
            values="M0,500 Q700,400 1400,500 T1920,500;M0,520 Q700,600 1400,520 T1920,520;M0,500 Q700,400 1400,500 T1920,500" />
        </path>
        {/* Animated glowing dots */}
        <circle cx="300" cy="400" r="6" fill="#a78bfa" opacity="0.18">
          <animate attributeName="cy" values="400;420;400" dur="6s" repeatCount="indefinite" />
        </circle>
        <circle cx="1200" cy="300" r="5" fill="#60a5fa" opacity="0.15">
          <animate attributeName="cy" values="300;340;300" dur="7s" repeatCount="indefinite" />
        </circle>
        <circle cx="1700" cy="600" r="7" fill="#a78bfa" opacity="0.13">
          <animate attributeName="cy" values="600;630;600" dur="8s" repeatCount="indefinite" />
        </circle>
        <circle cx="800" cy="900" r="4" fill="#60a5fa" opacity="0.13">
          <animate attributeName="cy" values="900;940;900" dur="9s" repeatCount="indefinite" />
        </circle>
        {/* More glowing dots for extra motion */}
        <circle cx="500" cy="700" r="8" fill="#a78bfa" opacity="0.10">
          <animate attributeName="cy" values="700;730;700" dur="11s" repeatCount="indefinite" />
        </circle>
        <circle cx="1600" cy="200" r="5" fill="#60a5fa" opacity="0.10">
          <animate attributeName="cy" values="200;250;200" dur="13s" repeatCount="indefinite" />
        </circle>
        <circle cx="1000" cy="500" r="10" fill="#a78bfa" opacity="0.08">
          <animate attributeName="cy" values="500;540;500" dur="15s" repeatCount="indefinite" />
        </circle>
        {/* Softly pulsing radial gradients */}
        <radialGradient id="pulse1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
        <circle cx="600" cy="300" r="120" fill="url(#pulse1)">
          <animate attributeName="r" values="120;150;120" dur="8s" repeatCount="indefinite" />
        </circle>
        <radialGradient id="pulse2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
        </radialGradient>
        <circle cx="1500" cy="800" r="100" fill="url(#pulse2)">
          <animate attributeName="r" values="100;140;100" dur="10s" repeatCount="indefinite" />
        </circle>
        {/* Animated drifting particles */}
        <circle cx="200" cy="200" r="3" fill="#a78bfa" opacity="0.18">
          <animate attributeName="cx" values="200;400;200" dur="12s" repeatCount="indefinite" />
          <animate attributeName="cy" values="200;220;200" dur="7s" repeatCount="indefinite" />
        </circle>
        <circle cx="1700" cy="400" r="2.5" fill="#60a5fa" opacity="0.16">
          <animate attributeName="cx" values="1700;1500;1700" dur="14s" repeatCount="indefinite" />
          <animate attributeName="cy" values="400;420;400" dur="8s" repeatCount="indefinite" />
        </circle>
        <circle cx="900" cy="200" r="2" fill="#a78bfa" opacity="0.13">
          <animate attributeName="cx" values="900;1100;900" dur="10s" repeatCount="indefinite" />
          <animate attributeName="cy" values="200;180;200" dur="6s" repeatCount="indefinite" />
        </circle>
        <circle cx="400" cy="900" r="3.5" fill="#60a5fa" opacity="0.14">
          <animate attributeName="cx" values="400;600;400" dur="13s" repeatCount="indefinite" />
          <animate attributeName="cy" values="900;880;900" dur="7s" repeatCount="indefinite" />
        </circle>
        {/* Blurred glowing blobs */}
        <filter id="blur1" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="40" />
        </filter>
        <circle cx="1000" cy="300" r="90" fill="#a78bfa" opacity="0.10" filter="url(#blur1)">
          <animate attributeName="cx" values="1000;1200;1000" dur="18s" repeatCount="indefinite" />
          <animate attributeName="cy" values="300;500;300" dur="15s" repeatCount="indefinite" />
        </circle>
        <circle cx="400" cy="600" r="70" fill="#60a5fa" opacity="0.09" filter="url(#blur1)">
          <animate attributeName="cx" values="400;600;400" dur="20s" repeatCount="indefinite" />
          <animate attributeName="cy" values="600;700;600" dur="17s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
} 