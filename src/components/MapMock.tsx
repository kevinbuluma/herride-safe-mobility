export function MapMock({ height = 280 }: { height?: number }) {
  return (
    <div
      className="map-bg relative w-full overflow-hidden rounded-3xl border border-white/60"
      style={{ height }}
    >
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full">
        <path
          d="M30 250 Q120 180 180 200 T370 60"
          fill="none"
          stroke="#e11d74"
          strokeWidth="4"
          strokeLinecap="round"
          className="route-line"
        />
        <circle cx="30" cy="250" r="8" fill="#fff" stroke="#e11d74" strokeWidth="3" />
        <circle cx="370" cy="60" r="8" fill="#e11d74" stroke="#fff" strokeWidth="3" />
      </svg>
      <div className="absolute right-3 top-3 glass rounded-full px-3 py-1 text-xs font-medium">
        Nairobi • Live
      </div>
      <div className="absolute bottom-3 left-3 glass rounded-full px-3 py-1 text-xs">
        ETA 8 min
      </div>
    </div>
  );
}