import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { authConfig } from './config';
export async function serverAuth() {
  const config = authConfig();
  if (!config) return null;
  const jar = await cookies();
  return createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (values) => {
        try { values.forEach(({name,value,options}) => jar.set(name,value,options)); }
        catch { /* Server Component cookies are refreshed by the proxy. */ }
      },
    },
  });
}
