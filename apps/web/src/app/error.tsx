"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      role="alert"
      className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center"
    >
      <h1 className="font-semibold text-2xl">Something went wrong</h1>
      <p className="text-muted">We couldn't load the deals. Please try again.</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-accent px-4 py-2 text-accent-fg"
      >
        Try again
      </button>
    </div>
  );
}
