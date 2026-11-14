import React, { useState, useRef, useCallback } from 'react';
import { HazardImage } from '../ui/HazardImage';
import { Columns, SplitSquareVertical, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils/date';

interface BeforeAfterSliderProps {
  beforePhotoUrl: string;
  afterPhotoUrl: string;
  category: string;
  description: string;
  beforeDate?: string;
  afterDate?: string;
  className?: string;
  heightClass?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforePhotoUrl,
  afterPhotoUrl,
  category,
  description,
  beforeDate,
  afterDate,
  className = '',
  heightClass = 'h-80 sm:h-96'
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(clamped);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header Bar with Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <span>Verified Municipal Transformation</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </h4>
        </div>

        <div className="inline-flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-[11px]">
          <button
            type="button"
            onClick={() => setViewMode('slider')}
            className={`px-2 py-0.5 rounded-md font-medium transition flex items-center gap-1 ${
              viewMode === 'slider' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SplitSquareVertical className="w-3 h-3" />
            <span>Split Reveal</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`px-2 py-0.5 rounded-md font-medium transition flex items-center gap-1 ${
              viewMode === 'side-by-side' ? 'bg-white text-teal-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns className="w-3 h-3" />
            <span>Side-by-Side</span>
          </button>
        </div>
      </div>

      {viewMode === 'slider' ? (
        /* INTERACTIVE SPLIT SLIDER */
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onTouchMove={handleTouchMove}
          className={`relative w-full ${heightClass} rounded-2xl overflow-hidden cursor-ew-resize select-none border border-slate-200 shadow-md bg-slate-900`}
        >
          {/* Base Layer: AFTER (Repaired) Image */}
          <div className="absolute inset-0 w-full h-full">
            <HazardImage
              src={afterPhotoUrl}
              alt={`Fixed ${category}`}
              category={category as any}
              description={`Repaired: ${description}`}
              className="w-full h-full object-cover"
            />
            {/* Top Right Label for AFTER */}
            <div className="absolute top-3 right-3 z-10">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600/90 text-white shadow-md backdrop-blur-xs flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>AFTER: Fixed & Certified</span>
              </span>
              {afterDate && (
                <span className="block text-[10px] text-emerald-200 text-right mt-0.5 font-mono drop-shadow-sm">
                  {formatDate(afterDate)}
                </span>
              )}
            </div>
          </div>

          {/* Top Layer: BEFORE (Reported) Image (clipped) */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <div
              className="absolute inset-0 h-full"
              style={{
                width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100vw'
              }}
            >
              <HazardImage
                src={beforePhotoUrl}
                alt={`Reported ${category}`}
                category={category as any}
                description={`Original: ${description}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Top Left Label for BEFORE */}
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-600/90 text-white shadow-md backdrop-blur-xs">
                BEFORE: Reported Defect
              </span>
              {beforeDate && (
                <span className="block text-[10px] text-rose-200 mt-0.5 font-mono drop-shadow-sm">
                  {formatDate(beforeDate)}
                </span>
              )}
            </div>
          </div>

          {/* Draggable Divider Handle */}
          <div
            className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-lg pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-blue-600 text-blue-700">
              <div className="flex items-center gap-0.5 text-[9px] font-bold">
                <span>◀</span>
                <span>▶</span>
              </div>
            </div>
          </div>

          {/* Bottom helper tooltip */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white text-[10px] backdrop-blur-xs pointer-events-none opacity-80">
            Drag slider left or right to compare before & after
          </div>
        </div>
      ) : (
        /* SIDE-BY-SIDE MODE */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="relative h-64 rounded-2xl overflow-hidden border border-rose-200 bg-slate-900 shadow-sm">
              <HazardImage
                src={beforePhotoUrl}
                alt={`Reported ${category}`}
                category={category as any}
                description={description}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-sm">
                BEFORE (Reported Defect)
              </span>
            </div>
            {beforeDate && (
              <div className="text-[11px] text-slate-500 font-mono">
                Filed: {formatDate(beforeDate)}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="relative h-64 rounded-2xl overflow-hidden border border-emerald-200 bg-slate-900 shadow-sm">
              <HazardImage
                src={afterPhotoUrl}
                alt={`Repaired ${category}`}
                category={category as any}
                description={description}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>AFTER (Repaired & Certified)</span>
              </span>
            </div>
            {afterDate && (
              <div className="text-[11px] text-emerald-700 font-mono font-medium">
                Certified: {formatDate(afterDate)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
