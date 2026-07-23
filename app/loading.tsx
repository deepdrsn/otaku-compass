export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-transparent border-t-neon-purple border-r-neon-blue" />
          <div className="absolute inset-2 animate-spin-slow rounded-full border-2 border-transparent border-b-neon-pink border-l-neon-cyan [animation-direction:reverse]" />
        </div>
        <p className="text-sm text-muted">Summoning anime...</p>
      </div>
    </div>
  );
}
