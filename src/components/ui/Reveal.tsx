'use client';

import { useEffect } from 'react';

/**
 * Makes `.reveal` elements settle into place as they are reached.
 *
 * One observer for the whole document rather than a wrapper component around
 * every section: this is a page of static content, and wrapping each block in
 * a client component to animate it would ship a component tree's worth of
 * JavaScript to move things fourteen pixels.
 *
 * Two things it is careful about.
 *
 * **Anything already on screen is revealed immediately, without transition.**
 * Otherwise the top of the page fades in on every load, which is the visual
 * signature of a site that is slower than it is.
 *
 * **It stops observing an element once it has appeared.** A reveal that
 * re-triggers on the way back up is a distraction, and the observer should not
 * outlive its usefulness.
 */

export default function Reveal() {
  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const showAll = () => {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    };

    // Asked for stillness, or the browser is too old for the observer: show
    // everything at once. Content must never depend on the animation running.
    if (still || typeof IntersectionObserver === 'undefined') {
      showAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      // Fires a little before the element arrives, so it has finished settling
      // by the time it is properly in view.
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    const attach = () => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          // Above the fold on arrival: no animation, just be there.
          el.classList.add('is-visible');
          (el as HTMLElement).style.transition = 'none';
          requestAnimationFrame(() => {
            (el as HTMLElement).style.transition = '';
          });
          return;
        }
        observer.observe(el);
      });
    };

    attach();

    // Client-side navigation swaps the content under us without remounting
    // this, so watch for new sections arriving.
    const mutation = new MutationObserver(() => attach());
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);

  return null;
}
