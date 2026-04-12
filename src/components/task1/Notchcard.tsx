// src/components/Notchcard.tsx
import { useCallback, useEffect, useRef } from "react";

export function NotchedCard({
  bg,
  className = "",
  children,
}: {
  className?: string;
  bg: string;
  children: React.ReactNode;
}) {
  const bgRef = useRef<HTMLDivElement>(null);

  const updateClip = useCallback(() => {
    const el = bgRef.current;
    if (!el) return;
    const W = el.offsetWidth;
    const H = el.offsetHeight;

    const r = 24;
    const nr = 72;
    const ns = 45;
    const sm = 3;
    const ny = H / 2;
    const fl = 24;

    const path = [
      `M ${r} 0`, `L ${W - r} 0`, `Q ${W} 0 ${W} ${r}`,
      `L ${W} ${ny - ns - fl}`, `Q ${W} ${ny - ns} ${W - fl} ${ny - ns}`,
      `C ${W - fl} ${ny - ns + sm}  ${W - nr} ${ny - ns + sm}  ${W - nr} ${ny}`,
      `C ${W - nr} ${ny + ns - sm}  ${W - fl} ${ny + ns - sm}  ${W - fl} ${ny + ns}`,
      `Q ${W} ${ny + ns} ${W} ${ny + ns + fl}`,
      `L ${W} ${H - r}`, `Q ${W} ${H} ${W - r} ${H}`,
      `L ${r} ${H}`, `Q 0 ${H} 0 ${H - r}`,
      `L 0 ${ny + ns + fl}`, `Q 0 ${ny + ns} ${fl} ${ny + ns}`,
      `C ${fl} ${ny + ns - sm}  ${nr} ${ny + ns - sm}  ${nr} ${ny}`,
      `C ${nr} ${ny - ns + sm}  ${fl} ${ny - ns + sm}  ${fl} ${ny - ns}`,
      `Q 0 ${ny - ns} 0 ${ny - ns - fl}`,
      `L 0 ${r}`, `Q 0 0 ${r} 0`, `Z`,
    ].join(" ");

    el.style.clipPath = `path('${path}')`;
  }, []);

  useEffect(() => {
    updateClip();
    const ro = new ResizeObserver(updateClip);
    if (bgRef.current) ro.observe(bgRef.current);
    return () => ro.disconnect();
  }, [updateClip]);

  return (
    <div className={`absolute inset-0 ${className}`}>
      {/* BACKGROUND LAYER - This is what gets clipped */}
      <div 
        ref={bgRef} 
        className="absolute inset-0" 
        style={{ backgroundColor: bg }} 
      />
      
      {/* CONTENT LAYER - This is NOT clipped, allowing overflow */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}