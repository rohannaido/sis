import React from "react";

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  circleOneStroke?: string;
  circleTwoStroke?: string;
  title?: string;
}

export default function CircularProgress({
  progress = 0,
  size = 120,
  strokeWidth = 5,
  circleOneStroke = "hsl(var(--secondary))",
  circleTwoStroke = "hsl(var(--primary))",
  title,
}: CircularProgressProps) {
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center">
      {title && (
        <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
      )}
      <div
        className="relative"
        style={{
          width: size,
          height: size,
          transition: "stroke-dashoffset 0.5s ease-in-out",
          transform: "rotate(-90deg)",
          transformOrigin: "center",
        }}
      >
        <svg width={size} height={size}>
          <circle
            stroke={circleOneStroke}
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            stroke={circleTwoStroke}
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (progress / 100) * circumference}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground"
          style={{
            transition: "stroke-dashoffset 0.5s ease-in-out",
            transform: "rotate(90deg)",
            transformOrigin: "center",
          }}
          aria-hidden="true"
        >
          {Math.round(progress)}%
        </div>
      </div>
      <div className="sr-only" role="status" aria-live="polite">
        {`Progress: ${Math.round(progress)}%`}
      </div>
    </div>
  );
}
