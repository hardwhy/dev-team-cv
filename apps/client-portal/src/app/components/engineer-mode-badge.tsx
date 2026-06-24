export function EngineerModeBadge() {
  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-mono text-green-500"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
      Engineer Mode — Shift+E to exit
    </div>
  );
}
