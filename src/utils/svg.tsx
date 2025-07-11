import React from 'react';

export const AnimatedEndlessRunner: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 142 80" className={className}>
      <g transform="translate(-7, 70)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; -190,0"
          keyTimes="0; 1"
          dur="2s"
          repeatCount="indefinite"
          additive="sum"
        />
        <rect x="0" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="12" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="24" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="36" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="48" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="60" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="72" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="84" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="96" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="108" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="120" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="132" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="144" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="156" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="168" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="180" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="192" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="204" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="216" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="228" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="240" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="252" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="264" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="276" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="288" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="300" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="312" y="0" width="10" height="10" rx="2" fill="currentFill" />
        <rect x="324" y="0" width="10" height="10" rx="2" fill="currentFill" />
      </g>

      {/* Bouncing block in center */}
      <g transform="translate(66, 60)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,-60; 0,0"
          keyTimes="0; 0.5; 1"
          dur="2s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.25 0.46 0.45 0.94; 0.55 0.055 0.675 0.19"
          additive="sum"
        />
        <rect x="0" y="0" width="10" height="10" rx="2" fill="currentColor" />
      </g>

      {/* I piece */}
      <g transform="translate(142, 60)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,0; -190,0; -190,0"
          keyTimes="0; 0; 0.2; 1"
          dur="10s"
          repeatCount="indefinite"
          additive="sum"
        />
        <rect x="0" y="0" width="10" height="10" rx="2" fill="#00b8db" />
        <text x="5" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">L</text>
        <rect x="12" y="0" width="10" height="10" rx="2" fill="#00b8db" />
        <text x="17" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">O</text>
        <rect x="24" y="0" width="10" height="10" rx="2" fill="#00b8db" />
        <text x="29" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">A</text>
        <rect x="36" y="0" width="10" height="10" rx="2" fill="#00b8db" />
        <text x="41" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">D</text>
      </g>

      {/* S piece */}
      <g transform="translate(142, 48)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,0; -190,0; -190,0"
          keyTimes="0; 0.2; 0.4; 1"
          dur="10s"
          repeatCount="indefinite"
          additive="sum"
        />
        <rect x="12" y="0" width="10" height="10" rx="2" fill="#ff6900" />
        <text x="17" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">G</text>
        <rect x="24" y="0" width="10" height="10" rx="2" fill="#ff6900" />
        <text x="29" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">!</text>
        <rect x="0" y="12" width="10" height="10" rx="2" fill="#ff6900" />
        <text x="5" y="19.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">I</text>
        <rect x="12" y="12" width="10" height="10" rx="2" fill="#ff6900" />
        <text x="17" y="19.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">N</text>
      </g>

      {/* Upside down T piece */}
      <g transform="translate(142, 48)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,0; -190,0; -190,0"
          keyTimes="0; 0.4; 0.6; 1"
          dur="10s"
          repeatCount="indefinite"
          additive="sum"
        />
        <rect x="12" y="0" width="10" height="10" rx="2" fill="#fa2b35" />
        <text x="17" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">W</text>
        <rect x="0" y="12" width="10" height="10" rx="2" fill="#fa2b35" />
        <text x="5" y="19.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">O</text>
        <rect x="12" y="12" width="10" height="10" rx="2" fill="#fa2b35" />
        <text x="17" y="19.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">O</text>
        <rect x="24" y="12" width="10" height="10" rx="2" fill="#fa2b35" />
        <text x="29" y="19.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">O</text>
      </g>

      {/* O piece */}
      <g transform="translate(142, 48)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,0; -190,0; -190,0"
          keyTimes="0; 0.6; 0.8; 1"
          dur="10s"
          repeatCount="indefinite"
          additive="sum"
        />
        <rect x="0" y="0" width="10" height="10" rx="2" fill="#f0b100" />
        <text x="5" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">B</text>
        <rect x="12" y="0" width="10" height="10" rx="2" fill="#f0b100" />
        <text x="17" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">L</text>
        <rect x="0" y="12" width="10" height="10" rx="2" fill="#f0b100" />
        <text x="5" y="19.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">K</text>
        <rect x="12" y="12" width="10" height="10" rx="2" fill="#f0b100" />
        <text x="17" y="19.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">L</text>
      </g>

      {/* Green J piece */}
      <g transform="translate(142, 36)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,0; -190,0; -190,0"
          keyTimes="0; 0.8; 1; 1"
          dur="10s"
          repeatCount="indefinite"
          additive="sum"
        />
        <rect x="0" y="24" width="10" height="10" rx="2" fill="#00c950" />
        <text x="5" y="31.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">!</text>
        <rect x="12" y="24" width="10" height="10" rx="2" fill="#00c950" />
        <text x="17" y="31.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">N</text>
        <rect x="12" y="0" width="10" height="10" rx="2" fill="#00c950" />
        <text x="17" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">F</text>
        <rect x="12" y="12" width="10" height="10" rx="2" fill="#00c950" />
        <text x="17" y="19.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">I</text>
      </g>
    </svg>
  );
};

export const AnimatedPuzzleDemo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 106 106" className={className}>
      <rect x="0" y="0" width="10" height="10" rx="2" fill="currentColor" />
      <rect x="12" y="0" width="10" height="10" rx="2" fill="currentColor" />
      <rect x="24" y="0" width="10" height="10" rx="2" fill="currentColor" />
      <rect x="36" y="0" width="10" height="10" rx="2" fill="currentColor" />
      <rect x="48" y="0" width="10" height="10" rx="2" fill="currentColor" />
      <rect x="60" y="0" width="10" height="10" rx="2" fill="currentColor" />
      <rect x="72" y="0" width="10" height="10" rx="2" fill="currentColor" />
      <rect x="84" y="0" width="10" height="10" rx="2" fill="currentColor" />
      <rect x="96" y="0" width="10" height="10" rx="2" fill="currentColor" />

      <g transform="translate(0, 12)">
        <rect x="0" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="12" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="24" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="36" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="48" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="60" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="72" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="84" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="96" y="0" width="10" height="10" rx="2" fill="currentColor" />
      </g>

      <g transform="translate(0, 24)">
        <rect x="0" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="12" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="24" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="36" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="48" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="60" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="72" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="84" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="96" y="0" width="10" height="10" rx="2" fill="currentColor" />
      </g>

      <g transform="translate(0, 36)">
        <rect x="0" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="12" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="24" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="36" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="48" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="60" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="72" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="84" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="96" y="0" width="10" height="10" rx="2" fill="currentColor" />
      </g>

      <g transform="translate(0, 48)">
        <rect x="0" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="12" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="24" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="36" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="48" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="60" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="72" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="84" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="96" y="0" width="10" height="10" rx="2" fill="currentColor" />
      </g>

      <g transform="translate(0, 60)">
        <rect x="0" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="12" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="24" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="36" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="48" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="60" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="72" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="84" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="96" y="0" width="10" height="10" rx="2" fill="currentColor" />
      </g>

      <g transform="translate(0, 72)">
        <rect x="0" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="12" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="24" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="36" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="48" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="60" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="72" y="0" width="10" height="10" rx="2" fill="#fff" />
        <rect x="84" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="96" y="0" width="10" height="10" rx="2" fill="currentColor" />
      </g>

      <g transform="translate(0, 84)">
        <rect x="0" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="12" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="24" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="36" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="48" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="60" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="72" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="84" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="96" y="0" width="10" height="10" rx="2" fill="currentColor" />
      </g>

      <g transform="translate(0, 96)">
        <rect x="0" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="12" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="24" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="36" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="48" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="60" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="72" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="84" y="0" width="10" height="10" rx="2" fill="currentColor" />
        <rect x="96" y="0" width="10" height="10" rx="2" fill="currentColor" />
      </g>

      {/* I piece */}
      <g transform="translate(0, 0)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,0; 24,24; 24,24"
          keyTimes="0; 0.125; 0.25; 1"
          dur="4s"
          repeatCount="indefinite"
          additive="sum"
          calcMode="spline"
          keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1"/>
        <rect x="0" y="0" width="10" height="10" rx="2" fill="#00b8db" />
        <text x="5" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">B</text>
        <rect x="0" y="12" width="10" height="10" rx="2" fill="#00b8db" />
        <text x="5" y="19.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">D</text>
        <rect x="0" y="24" width="10" height="10" rx="2" fill="#00b8db" />
        <text x="5" y="31.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">H</text>
        <rect x="0" y="36" width="10" height="10" rx="2" fill="#00b8db" />
        <text x="5" y="43.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">T</text>
      </g>

      {/* S piece */}
      <g transform="translate(0, 84)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,0; 24,-24; 24,-24"
          keyTimes="0; 0.25; 0.375; 1"
          dur="4s"
          repeatCount="indefinite"
          additive="sum"
          calcMode="spline"
          keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1"/>
        <rect x="12" y="0" width="10" height="10" rx="2" fill="#ff6900" />
        <text x="17" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">I</text>
        <rect x="24" y="0" width="10" height="10" rx="2" fill="#ff6900" />
        <text x="29" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">M</text>
        <rect x="0" y="12" width="10" height="10" rx="2" fill="#ff6900" />
        <text x="5" y="19.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">T</text>
        <rect x="12" y="12" width="10" height="10" rx="2" fill="#ff6900" />
        <text x="17" y="19.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">O</text>
      </g>

      {/* Upside down T piece */}
      <g transform="translate(72, 84)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,0; -24,-24; -24,-24"
          keyTimes="0; 0.375; 0.5; 1"
          dur="4s"
          repeatCount="indefinite"
          additive="sum"
          calcMode="spline"
          keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1"/>
        <rect x="12" y="0" width="10" height="10" rx="2" fill="#fa2b35" />
        <text x="17" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">E</text>
        <rect x="0" y="12" width="10" height="10" rx="2" fill="#fa2b35" />
        <text x="5" y="19.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">D</text>
        <rect x="12" y="12" width="10" height="10" rx="2" fill="#fa2b35" />
        <text x="17" y="19.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">A</text>
        <rect x="24" y="12" width="10" height="10" rx="2" fill="#fa2b35" />
        <text x="29" y="19.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">Y</text>
      </g>

      {/* O piece */}
      <g transform="translate(36, 0)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,0; 0,36; 0,36"
          keyTimes="0; 0.5; 0.625; 1"
          dur="4s"
          repeatCount="indefinite"
          additive="sum"
          calcMode="spline"
          keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1"/>
        <rect x="0" y="0" width="10" height="10" rx="2" fill="#f0b100" />
        <text x="5" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">A</text>
        <rect x="12" y="0" width="10" height="10" rx="2" fill="#f0b100" />
        <text x="17" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">I</text>
        <rect x="0" y="12" width="10" height="10" rx="2" fill="#f0b100" />
        <text x="5" y="19.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">A</text>
        <rect x="12" y="12" width="10" height="10" rx="2" fill="#f0b100" />
        <text x="17" y="19.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">P</text>
      </g>

      {/* Green J piece */}
      <g transform="translate(72, 0)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,0; -36,24; -36,24"
          keyTimes="0; 0.625; 0.75; 1"
          dur="4s"
          repeatCount="indefinite"
          additive="sum"
          calcMode="spline"
          keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1"/>
        <rect x="0" y="0" width="10" height="10" rx="2" fill="#00c950" />
        <text x="5" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">L</text>
        <rect x="12" y="0" width="10" height="10" rx="2" fill="#00c950" />
        <text x="17" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">O</text>
        <rect x="24" y="0" width="10" height="10" rx="2" fill="#00c950" />
        <text x="29" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">C</text>
        <rect x="24" y="12" width="10" height="10" rx="2" fill="#00c950" />
        <text x="29" y="19.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">L</text>
      </g>

      {/* Purple J piece */}
      <g transform="translate(84, 36)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,0; -24,-12; -24,-12"
          keyTimes="0; 0.75; 0.875; 1"
          dur="4s"
          repeatCount="indefinite"
          additive="sum"
          calcMode="spline"
          keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1"/>
        <rect x="12" y="0" width="10" height="10" rx="2" fill="#ad46ff" />
        <text x="17" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">K</text>
        <rect x="12" y="12" width="10" height="10" rx="2" fill="#ad46ff" />
        <text x="17" y="19.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">Y</text>
        <rect x="0" y="24" width="10" height="10" rx="2" fill="#ad46ff" />
        <text x="5" y="31.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">P</text>
        <rect x="12" y="24" width="10" height="10" rx="2" fill="#ad46ff" />
        <text x="17" y="31.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">Y</text>
      </g>

      {/* Empty tile */}
      <g transform="translate(72, 60)" opacity="0">
        <animate
          attributeName="opacity"
          values="0; 0; 1; 1"
          keyTimes="0; 0.875; 0.9; 1"
          dur="4s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1"/>
        <rect x="0" y="0" width="10" height="10" rx="2" fill="#1e2939" />
        <text x="5" y="7.75" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white"
          textAnchor="middle">S</text>
      </g>
    </svg>
  );
};