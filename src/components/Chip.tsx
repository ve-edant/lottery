import React from "react";

interface ChipProps {
  label?: number | string;
  width?: number; // px
  height?: number; // px
  borderWidth?: number;
  className?: string; // Add className prop for responsive styling
}

const getColorsForLabel = (label: number | string) => {
  switch (label) {
    case 0:
      return { 
        bgColor: "#dc2626", // Rich red
        borderColor: "#7c2d12", // Dark red-brown
        innerDashed: "#fef2f2", // Light red
        accentColor: "#991b1b" // Darker red
      };
    case 5:
      return { 
        bgColor: "#7c3aed", // Rich purple
        borderColor: "#3730a3", // Dark purple-blue
        innerDashed: "#f5f3ff", // Light purple
        accentColor: "#5b21b6" // Darker purple
      };
    case 1:
    case 3:
    case 7:
    case 9:
      return { 
        bgColor: "#16a34a", // Rich green
        borderColor: "#14532d", // Dark green
        innerDashed: "#f0fdf4", // Light green
        accentColor: "#15803d" // Darker green
      };
    case 2:
    case 4:
    case 6:
    case 8:
      return { 
        bgColor: "#dc2626", // Rich red
        borderColor: "#7f1d1d", // Dark red
        innerDashed: "#fef2f2", // Light red
        accentColor: "#991b1b" // Darker red
      };
    default:
      return { 
        bgColor: "#374151", 
        borderColor: "#111827", 
        innerDashed: "#d1d5db",
        accentColor: "#1f2937"
      };
  }
};

const Chip: React.FC<ChipProps> = ({
  label = "",
  width = 80, // Reduced default size
  height = 80,
  borderWidth = 6, // Reduced default border
  className = "",
}) => {
  const { bgColor, borderColor, innerDashed, accentColor } = getColorsForLabel(label);
  
  return (
    <div
      className={`relative flex items-center justify-center rounded-full flex-shrink-0 ${className}`}
      style={{ 
        width: `min(${width}px, 20vw)`, // Responsive width
        height: `min(${height}px, 20vw)`, // Responsive height
        minWidth: '30px', // Minimum size
        minHeight: '30px'
      }}
    >
      {/* Main chip body with gradient */}
      <div
        className="absolute rounded-full shadow-2xl"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(145deg, ${bgColor}, ${accentColor})`,
          boxShadow: `
            0 10px 20px rgba(0,0,0,0.4),
            inset 0 2px 4px rgba(255,255,255,0.2),
            inset 0 -2px 4px rgba(0,0,0,0.2)
          `
        }}
      />
      
      {/* Outer decorative border */}
      <div
        className="absolute rounded-full"
        style={{
          top: `min(${borderWidth / 2}px, 1.5vw)`,
          left: `min(${borderWidth / 2}px, 1.5vw)`,
          right: `min(${borderWidth / 2}px, 1.5vw)`,
          bottom: `min(${borderWidth / 2}px, 1.5vw)`,
          borderWidth: `min(${borderWidth / 2}px, 1.5vw)`,
          borderColor: borderColor,
          borderStyle: "solid",
          background: `conic-gradient(from 0deg, ${borderColor}, ${accentColor}, ${borderColor})`
        }}
      />
      
      {/* Inner ring with dashed pattern */}
      <div
        className="absolute rounded-full"
        style={{
          top: `min(${borderWidth}px, 3vw)`,
          left: `min(${borderWidth}px, 3vw)`,
          right: `min(${borderWidth}px, 3vw)`,
          bottom: `min(${borderWidth}px, 3vw)`,
          borderWidth: `min(2px, 0.5vw)`,
          borderColor: innerDashed,
          borderStyle: "dashed",
          backgroundColor: "rgba(255,255,255,0.1)",
        }}
      />
      
      {/* Center highlight circle */}
      <div
        className="absolute rounded-full"
        style={{
          top: "30%",
          left: "30%",
          right: "30%",
          bottom: "30%",
          background: `radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 70%, transparent 100%)`,
        }}
      />
      
      {/* Corner decorative elements - responsive sizes */}
      <div
        className="absolute rounded-full"
        style={{
          top: `min(${borderWidth * 1.5}px, 4.5vw)`,
          left: `min(${borderWidth * 1.5}px, 4.5vw)`,
          width: `min(8px, 2vw)`,
          height: `min(8px, 2vw)`,
          backgroundColor: innerDashed,
          boxShadow: `0 0 4px ${innerDashed}`
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          top: `min(${borderWidth * 1.5}px, 4.5vw)`,
          right: `min(${borderWidth * 1.5}px, 4.5vw)`,
          width: `min(8px, 2vw)`,
          height: `min(8px, 2vw)`,
          backgroundColor: innerDashed,
          boxShadow: `0 0 4px ${innerDashed}`
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          bottom: `min(${borderWidth * 1.5}px, 4.5vw)`,
          left: `min(${borderWidth * 1.5}px, 4.5vw)`,
          width: `min(8px, 2vw)`,
          height: `min(8px, 2vw)`,
          backgroundColor: innerDashed,
          boxShadow: `0 0 4px ${innerDashed}`
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          bottom: `min(${borderWidth * 1.5}px, 4.5vw)`,
          right: `min(${borderWidth * 1.5}px, 4.5vw)`,
          width: `min(8px, 2vw)`,
          height: `min(8px, 2vw)`,
          backgroundColor: innerDashed,
          boxShadow: `0 0 4px ${innerDashed}`
        }}
      />
      
      {/* Label with responsive font sizing */}
      <span 
        className="relative font-black text-white z-10"
        style={{
          fontSize: `clamp(12px, ${Math.min(width, height) * 0.25}px, 5vw)`,
          textShadow: `
            2px 2px 4px rgba(0,0,0,0.8),
            0 0 8px rgba(0,0,0,0.6),
            1px 1px 0px ${accentColor}
          `,
          letterSpacing: "0.05em"
        }}
      >
        {label}
      </span>
    </div>
  );
};

export default Chip;