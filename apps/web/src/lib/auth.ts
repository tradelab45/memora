'use client';
import { createContext, useContext } from 'react';
import { browserAuth } from '@/lib/supabase/client';
import { safeNext } from '@/lib/supabase/config';
import { setMusicOwner } from '@/lib/music';
export interface UserProfile { id: string; name: string; email: string; createdAt: string; }
export const AuthContext = createContext<{user: UserProfile | null; loading: boolean}>({user:null,loading:true});
export function useUser() { return useContext(AuthContext).user; }
export function useAuth() { return useContext(AuthContext); }
export async function signInWithGoogle(next = '/studio') {
  const client = browserAuth();
  if (!client) throw new Error('Google sign-in is being set up. Please try again soon.');
  const callback = new URL('/auth/callback', window.location.origin);
  callback.searchParams.set('next', safeNext(next));
  const {error} = await client.auth.signInWithOAuth({provider:'google', options:{redirectTo:callback.href, queryParams:{prompt:'select_account'}}});
  if (error) throw new Error('Google sign-in could not start. Please try again.');
}
export async function signOutUser() {
  setMusicOwner(null);
  const client = browserAuth();
  if (client) {
    const {error} = await client.auth.signOut({scope:'local'});
    if (error) throw new Error('Could not finish signing out. Check your connection and retry.');
  }
  window.location.replace('/signin');
}
