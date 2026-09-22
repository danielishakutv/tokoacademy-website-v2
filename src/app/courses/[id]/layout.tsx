/**
 * A pass-through, deliberately.
 *
 * This layout used to carry its own `generateStaticParams` and
 * `generateMetadata`, both hitting the legacy PHP catalogue — the same two
 * jobs the page beside it was already doing, against the same endpoint, with
 * different fallbacks and a different idea of which courses existed. Two
 * sources of truth for one page's title is one too many, and the layout's copy
 * had a hardcoded list of course codes that had already drifted out of date.
 *
 * The page owns the data and the metadata now. This file exists only to keep
 * the route segment, and should stay empty of logic.
 */
export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
