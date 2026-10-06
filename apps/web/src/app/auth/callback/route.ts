import { NextRequest, NextResponse } from 'next/server';
import { serverAuth } from '@/lib/supabase/server';
import { safeNext } from '@/lib/supabase/config';
export async function GET(request:NextRequest) {
  const code=request.nextUrl.searchParams.get('code');
  const next=safeNext(request.nextUrl.searchParams.get('next'));
  const client=await serverAuth();
  if(code&&client) {
    try {
      const {error}=await client.auth.exchangeCodeForSession(code);
      if(!error) {
        const {data:{user}}=await client.auth.getUser();
        if(user&&!user.is_anonymous&&user.app_metadata.providers?.includes('google')) return NextResponse.redirect(new URL(next,request.url));
        await client.auth.signOut({scope:'local'});
      }
    } catch { /* Retry through the visible sign-in page. */ }
  }
  return NextResponse.redirect(new URL('/signin?error=callback',request.url));
}
