"use client";

import { useRef, useState, useCallback } from "react";

export function LargeTitle() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setGradientPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 py-6 md:py-12">
      <div className="flex w-full items-center justify-center overflow-hidden">
        <div className="w-full max-w-none">
          <svg
            ref={svgRef}
            aria-label="Exodia SVG"
            className="cursor-pointer transition-all duration-300 h-auto w-full"
            fill="none"
            viewBox="0 0 1400 320"
            xmlns="http://www.w3.org/2000/svg"
            style={{ maxWidth: "100%", height: "auto" }}
            onMouseMove={handleMouseMove}
          >
            <title>Exodia</title>
            <defs>
              <radialGradient
                cx={`${gradientPosition.x}px`}
                cy={`${gradientPosition.y}px`}
                gradientUnits="userSpaceOnUse"
                id="exodia-gradient"
                r="220"
              >
                <stop offset="0%" stopColor="white" />
                <stop offset="70%" stopColor="#0d7239" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <mask id="exodia-mask">
                <rect fill="black" height="100%" width="100%" />
                <circle
                  cx={`${gradientPosition.x}px`}
                  cy={`${gradientPosition.y}px`}
                  fill="white"
                  r="220"
                />
              </mask>
              <linearGradient
                id="text-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#292524" />
                <stop offset="100%" stopColor="#292524" />
              </linearGradient>
            </defs>

            {/* Base text layer */}
            <text
              x="700"
              y="250"
              textAnchor="middle"
              className="font-black"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "240px",
                fontWeight: 900,
                fill: "none",
                stroke: "#292524",
                strokeWidth: "1.5",
              }}
            >
              EXODIA
            </text>

            {/* Highlight layer with gradient */}
            <g mask="url(#exodia-mask)">
              <text
                x="700"
                y="250"
                textAnchor="middle"
                className="font-black"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "240px",
                  fontWeight: 900,
                  fill: "none",
                  stroke: "url(#exodia-gradient)",
                  strokeWidth: "2.25",
                }}
              >
                EXODIA
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
