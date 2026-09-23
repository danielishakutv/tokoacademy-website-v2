'use client';

import { useEffect } from 'react';

/**
 * Publishes the pointer's position as two CSS variables on :root.
 *
 * `--px` and `--py` run from -1 to 1, with 0,0 at the centre of the window.
 * `.aurora` in globals.css uses them to drift its colour washes a couple of
 * dozen pixels against the pointer, which is the whole of the "shapes that
 * respond to the mouse" effect: parallax you would only notice if you went
 * looking for it, and never something that competes with the text.
 *
 * Doing it in CSS variables rather than in React means one write per frame to
 * a single element, and every decorative layer on the page moves from it —
 * adding another costs nothing and needs no JavaScript of its own.
 *
 * Off entirely for touch devices, which have no hovering pointer to track,
 * and for anyone who has asked for reduced motion. Throttled to one write per
 * animation frame: a mousemove handler can fire far more often than the
 * screen refreshes, and the extra writes are work nobody sees.
 */
export default function PointerField() {
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || still) return;

    const root = document.documentElement;
    let x = 0;
    let y = 0;
    let queued = false;

    const write = () => {
      queued = false;
      root.style.setProperty('--px', x.toFixed(3));
      root.style.setProperty('--py', y.toFixed(3));
    };

    const onMove = (event: MouseEvent) => {
      x = (event.clientX / window.innerWidth) * 2 - 1;
      y = (event.clientY / window.innerHeight) * 2 - 1;
      if (queued) return;
      queued = true;
      requestAnimationFrame(write);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      root.style.removeProperty('--px');
      root.style.removeProperty('--py');
    };
  }, []);

  return null;
}
