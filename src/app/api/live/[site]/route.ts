import type { NextRequest } from 'next/server';
import { analyzeSite, LiveUnavailableError } from '@/lib/live/analyze';
import { isSiteId } from '@/lib/live/sites';

export async function GET(request: NextRequest, ctx: RouteContext<'/api/live/[site]'>) {
  const { site } = await ctx.params;
  if (!isSiteId(site)) {
    return Response.json({ error: `Unknown site "${site}". Use riyadh or dhahran.` }, { status: 404 });
  }

  const refresh = request.nextUrl.searchParams.get('refresh') === '1';
  try {
    const result = await analyzeSite(site, { refresh });
    return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    const message = e instanceof LiveUnavailableError ? e.message : 'Live analysis failed unexpectedly.';
    if (!(e instanceof LiveUnavailableError)) console.error('[live] unexpected error', e);
    return Response.json({ error: message }, { status: 503 });
  }
}
