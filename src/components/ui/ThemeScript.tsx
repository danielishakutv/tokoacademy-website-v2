/**
 * Sets the theme before the browser paints anything.
 *
 * Without this there is a flash: the page renders in light, then JavaScript
 * runs, then it snaps to dark. On a slow connection that flash can last most
 * of a second, and it is the single thing that makes a dark mode feel
 * bolted on.
 *
 * So this runs as a blocking inline script in <head> — the one place a
 * blocking script is the right answer, because it is three lines and it has
 * to finish before the first paint. Deliberately not a React component with
 * an effect: an effect runs after paint, which is exactly too late.
 *
 * The stored choice wins; the system preference is the starting point, not
 * the final word. Everything is wrapped because a private window can throw on
 * localStorage, and a theme is not worth a blank page.
 */

const SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('toko-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored ? stored === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}

export default ThemeScript;
