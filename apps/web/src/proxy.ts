import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { authConfig } from '@/lib/supabase/config';
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const config = authConfig();
  if (config) {
    const supabase = createServerClient(config.url, config.key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(values) {
          values.forEach(({name,value}) => request.cookies.set(name,value));
          response = NextResponse.next({ request });
          values.forEach(({name,value,options}) => response.cookies.set(name,value,options));
        },
      },
    });
    try { await supabase.auth.getUser(); } catch { /* The route guard fails closed. */ }
  }
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
export const config = { matcher: ['/studio/:path*', '/auth/:path*', '/signin'] };
