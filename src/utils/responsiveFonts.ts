import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';

// Responsive font scaling utility
export interface ResponsiveFontConfig {
  base: number;        // Base font size in rem
  scale: number;       // Scaling factor (0.8 = 20% smaller per breakpoint)
  minScale: number;    // Minimum scale factor
  maxScale: number;    // Maximum scale factor
}

// Default configurations for different font types
export const FONT_CONFIGS = {
  // Main word display - most important scaling
  wordDisplay: {
    base: 3,           // 3rem base
    scale: 0.85,       // Scale down 15% per breakpoint
    minScale: 0.4,     // Minimum 40% of base size
    maxScale: 1.2,     // Maximum 120% of base size
  },
  
  // Time greeting - large but not as critical
  timeGreeting: {
    base: 1.25,        // 1.25rem base
    scale: 0.9,        // Scale down 10% per breakpoint
    minScale: 0.5,     // Minimum 50% of base size
    maxScale: 1.1,     // Maximum 110% of base size
  },
  
  // Clock display - needs to be readable
  clockDisplay: {
    base: 3.75,        // 3.75rem base (text-6xl)
    scale: 0.8,        // Scale down 20% per breakpoint
    minScale: 0.3,     // Minimum 30% of base size
    maxScale: 1.0,     // Maximum 100% of base size
  },
  
  // Meaning text - secondary content
  meaningText: {
    base: 1.1,         // 1.1rem base
    scale: 0.9,        // Scale down 10% per breakpoint
    minScale: 0.6,     // Minimum 60% of base size
    maxScale: 1.0,     // Maximum 100% of base size
  },
  
  // Example text - tertiary content
  exampleText: {
    base: 1.15,        // 1.15rem base
    scale: 0.9,        // Scale down 10% per breakpoint
    minScale: 0.6,     // Minimum 60% of base size
    maxScale: 1.0,     // Maximum 100% of base size
  },
  
  // Language selector and buttons
  uiElements: {
    base: 1,           // 1rem base
    scale: 0.95,       // Scale down 5% per breakpoint
    minScale: 0.7,     // Minimum 70% of base size
    maxScale: 1.0,     // Maximum 100% of base size
  },
} as const;

// Breakpoints for responsive scaling
export const BREAKPOINTS = {
  xs: 480,    // Extra small phones
  sm: 640,    // Small phones
  md: 768,    // Tablets
  lg: 1024,   // Small laptops
  xl: 1280,   // Large screens
  '2xl': 1536, // Extra large screens
} as const;

// Calculate responsive font size based on screen width
export const calculateResponsiveFontSize = (
  config: ResponsiveFontConfig,
  screenWidth: number
): number => {
  const { base, scale, minScale, maxScale } = config;
  
  // Determine scale factor based on screen width
  let scaleFactor = 1;
  
  if (screenWidth <= BREAKPOINTS.xs) {
    // Extra small screens: apply maximum scaling
    scaleFactor = Math.max(minScale, scale * scale * scale * scale);
  } else if (screenWidth <= BREAKPOINTS.sm) {
    // Small screens: apply significant scaling
    scaleFactor = Math.max(minScale, scale * scale * scale);
  } else if (screenWidth <= BREAKPOINTS.md) {
    // Medium screens: apply moderate scaling
    scaleFactor = Math.max(minScale, scale * scale);
  } else if (screenWidth <= BREAKPOINTS.lg) {
    // Large screens: apply light scaling
    scaleFactor = Math.max(minScale, scale);
  } else if (screenWidth <= BREAKPOINTS.xl) {
    // Extra large screens: minimal scaling
    scaleFactor = Math.max(minScale, 0.95);
  } else {
    // Very large screens: no scaling or slight increase
    scaleFactor = Math.min(maxScale, 1.0);
  }
  
  // Apply scale factor to base size
  const finalSize = base * scaleFactor;
  
  // Ensure we don't exceed min/max bounds
  return Math.max(base * minScale, Math.min(base * maxScale, finalSize));
};

// Hook for responsive font sizing
export const useResponsiveFont = (config: ResponsiveFontConfig) => {
  const [fontSize, setFontSize] = useState(() => 
    calculateResponsiveFontSize(config, window.innerWidth)
  );
  
  useEffect(() => {
    const handleResize = () => {
      const newSize = calculateResponsiveFontSize(config, window.innerWidth);
      setFontSize(newSize);
    };
    
    // Set initial size
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [config]);
  
  return fontSize;
};

// Utility function to get responsive font size for a specific config
export const getResponsiveFontSize = (
  configKey: keyof typeof FONT_CONFIGS,
  screenWidth?: number
): number => {
  const width = screenWidth ?? window.innerWidth;
  const config = FONT_CONFIGS[configKey];
  return calculateResponsiveFontSize(config, width);
};

// CSS custom properties for responsive fonts
export const generateResponsiveFontCSS = () => {
  const css = Object.entries(FONT_CONFIGS).map(([key, config]) => {
    const sizes = Object.entries(BREAKPOINTS).map(([breakpoint, width]) => {
      const size = calculateResponsiveFontSize(config, width);
      return `@media (max-width: ${width}px) { --font-${key}: ${size}rem; }`;
    }).join('\n');
    
    return `:root { --font-${key}: ${config.base}rem; }\n${sizes}`;
  }).join('\n\n');
  
  return css;
};

// Helper function to create responsive style object
export const createResponsiveFontStyle = (
  configKey: keyof typeof FONT_CONFIGS,
  additionalStyles: CSSProperties = {}
): CSSProperties => {
  const config = FONT_CONFIGS[configKey];
  const fontSize = calculateResponsiveFontSize(config, window.innerWidth);
  
  return {
    fontSize: `${fontSize}rem`,
    ...additionalStyles,
  };
};
