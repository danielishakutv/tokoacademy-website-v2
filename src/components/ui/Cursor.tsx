'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A pointer that follows, and a ring that lags behind it.
 *
 * Two rules keep this on the right side of tasteful.
 *
 * **It never replaces the system cursor on anything that needs one.** The
 * native arrow stays; this is drawn over it, and text fields, which rely on
 * the I-beam to show where the caret will land, are left alone entirely.
 *
 * **It is switched off wherever it would be wrong.** Touch devices have no
 * pointer to decorate. A visitor who has asked for reduced motion has asked
 * for exactly this to stop. In both cases the component renders nothing at
 * all rather than rendering something hidden.
 *
 * The movement is written straight to the DOM in a requestAnimationFrame loop
 * rather than through React state. A cursor updates on every mouse move —
 * sixty or more renders a second — and putting that through React would make
 * the whole page stutter to animate a dot.
 */

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Decided after mount: the server knows nothing about the visitor's device.
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(fine && !still);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let frame = 0;
    let visible = false;

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

      // Is the pointer over something you can act on?
      const target = event.target as Element | null;
      const interactive = target?.closest('a, button, [role="button"], input, select, textarea, summary');
      const isText = target?.closest('input[type="text"], input[type="email"], input[type="tel"], textarea');
      ring.dataset.state = isText ? 'text' : interactive ? 'active' : 'idle';
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    // The ring eases toward the pointer; the dot is exact. The gap between
    // them is the whole effect.
    const tick = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] size-1.5 rounded-full bg-brand opacity-0 transition-opacity duration-300"
      />
      <div
        ref={ringRef}
        aria-hidden
        data-state="idle"
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border border-brand/60 opacity-0
                   transition-[width,height,opacity,background-color,border-color] duration-200
                   data-[state=idle]:size-8
                   data-[state=active]:size-12 data-[state=active]:bg-brand/10
                   data-[state=text]:h-7 data-[state=text]:w-px data-[state=text]:rounded-none data-[state=text]:bg-brand/70"
      />
    </>
  );
}
