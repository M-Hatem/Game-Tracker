import { getDeals } from "@/lib/deals";

/**
 * JSON snapshot of all deals. The future mobile and desktop apps can read
 * this endpoint, or import `@gt/core` and fetch the sources directly.
 */
export const revalidate = 1800;

export async function GET() {
  const snapshot = await getDeals();
  return Response.json(snapshot, {
    headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
  });
}
