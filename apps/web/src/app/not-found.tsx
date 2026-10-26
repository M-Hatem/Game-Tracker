import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
      <h1 className="font-semibold text-2xl">Page not found</h1>
      <Link href="/" className="text-accent underline-offset-2 hover:underline">
        Back to deals
      </Link>
    </div>
  );
}
