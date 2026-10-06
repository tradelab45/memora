'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
export function AuthBoundary({userId,children}:{userId:string;children:React.ReactNode}) {
  const {user,loading} = useAuth();
  if (loading) return <main id="main-content" className="auth-page"><p role="status">Opening your memories…</p></main>;
  if (!user || user.id !== userId) return <main id="main-content" className="auth-page"><h1>Sign in to continue.</h1><p>Your session has ended. Your saved memories remain on this device.</p><Link className="card-primary-cta" href="/signin">Sign in with Google</Link></main>;
  return children;
}
