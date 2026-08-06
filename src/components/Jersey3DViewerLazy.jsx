import { lazy, Suspense } from 'react';

// Lazy-load the heavy Three.js-based component
const Jersey3DViewerInner = lazy(() => import('./Jersey3DViewer'));

function LoadingFallback({ height = 500 }) {
  return (
    <div
      className="relative w-full flex items-center justify-center"
      style={{ height }}
    >
      {/* Ambient glow placeholder */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: '50%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
        }}
      />
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
        <p className="text-white/20 text-xs uppercase tracking-wider">
          Loading 3D Viewer…
        </p>
      </div>
    </div>
  );
}

/**
 * Jersey3DViewerLazy — code-split wrapper for the Three.js-based jersey viewer.
 * Three.js (~400KB gzipped) is loaded only when this component mounts.
 *
 * Accepts all the same props as Jersey3DViewer.
 */
export default function Jersey3DViewerLazy(props) {
  return (
    <Suspense fallback={<LoadingFallback height={props.height} />}>
      <Jersey3DViewerInner {...props} />
    </Suspense>
  );
}
