export function WaveDivider() {
  return (
    <div className="relative h-[80px] md:h-[150px] overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1920 150"
        preserveAspectRatio="none"
      >
        {[...Array(8)].map((_, i) => (
          <path
            key={i}
            d={`M0 ${75 + i * 5} Q480 ${60 + i * 8} 960 ${75 + i * 5} T1920 ${
              75 + i * 5
            }`}
            fill="none"
            stroke="#0d7239"
            strokeWidth="1"
            strokeOpacity={0.15 + i * 0.02}
          />
        ))}
      </svg>
    </div>
  );
}

