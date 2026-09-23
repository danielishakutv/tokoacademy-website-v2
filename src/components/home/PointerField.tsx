'use client';

import { useEffect, useRef } from 'react';

/**
 * The colour wash behind a section, drifting very slightly with the pointer.
 *
 * `globals.css` already draws the wash: `.aurora` is two blurred circles whose
 * transforms read `--px` and `--py` off their ancestor. Nothing in the site set
 * those variables, so the wash sat perfectly still. This is the missing half —
 * the "shapes that respond to the mouse", kept to roughly twenty pixels of
 * travel, which is the difference between a page that feels alive and a page
 * that feels like a screensaver.
 *
 * It writes to the parent's inline style rather than to React state. A mouse
 * moves sixty or more times a second and re-rendering a page section that
 * often to shift a blurred circle would be an absurd price for the effect.
 *
 * It does nothing at all on a touch screen — there is no pointer to follow —
 * or where reduced motion has been asked for. In both cases the wash is still
 * drawn; it simply stays where it is.
 */
export default function PointerField({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The section this sits inside. Setting the variables on the parent rather
    // than on the `.aurora` element itself means anything else in the section
    // can read them too.
    const host = ref.current?.parentElement;
    if (!host) return;

    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;

    const onMove = (event: MouseEvent) => {
      // One update per painted frame. Mouse events fire faster than the screen
      // refreshes, and the extra ones would be thrown away anyway.
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const box = host.getBoundingClientRect();
        if (!box.width || !box.height) return;
        // -1 at one edge, +1 at the other, 0 in the middle.
        host.style.setProperty('--px', String(((event.clientX - box.left) / box.width - 0.5) * 2));
        host.style.setProperty('--py', String(((event.clientY - box.top) / box.height - 0.5) * 2));
      });
    };

    host.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      host.removeEventListener('mousemove', onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} className={`aurora ${className}`} aria-hidden />;
}
