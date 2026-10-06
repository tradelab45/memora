import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { GoogleSignIn } from '@/components/auth/google-sign-in';
import { safeNext } from '@/lib/supabase/config';
import '@/components/auth/auth.css';
export const metadata={title:'Sign in',robots:{index:false,follow:false}};
export default async function SignInPage({searchParams}:{searchParams:Promise<{next?:string;error?:string}>}) {
  const params=await searchParams;
  return <><SiteHeader/><main id="main-content" className="auth-page"><section className="auth-standalone-card"><p className="eyebrow">YOUR NEXT CHAPTER</p><h1>A life worth<br/><em>keeping.</em></h1><p>Sign in with Google to open your personal library and create a book.</p>{params.error&&<p role="alert" className="auth-message">Sign-in did not finish. Please try again.</p>}<GoogleSignIn next={safeNext(params.next)}/><p className="auth-message">Photos and songs you choose stay in this browser. Use a backup to keep another copy.</p><Link href="/">Back to Memora</Link></section></main></>;
}
