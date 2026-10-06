import { createBrowserClient } from '@supabase/ssr';
import { authConfig } from './config';
let client: ReturnType<typeof createBrowserClient> | null = null;
export function browserAuth() {
  const config = authConfig();
  if (!config) return null;
  client ??= createBrowserClient(config.url, config.key);
  return client;
}
