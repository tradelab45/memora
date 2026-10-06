'use client';
import { useEffect, useState } from 'react';
import { AuthContext, type UserProfile } from '@/lib/auth';
import { browserAuth } from '@/lib/supabase/client';
import { setMusicOwner } from '@/lib/music';
export function AuthProvider({children}:{children:React.ReactNode}) {
  const [auth,setAuth] = useState<{user:UserProfile|null;loading:boolean}>({user:null,loading:true});
  useEffect(() => {
    let alive = true;
    let revision = 0;
    const client = browserAuth();
    try { localStorage.removeItem('memora-user-session'); } catch { /* Legacy demo state is never trusted. */ }
    async function refresh() {
      const token = ++revision;
      try {
        const result = await client?.auth.getUser();
        const user = result?.data.user;
        const verified = user && !result?.error && !user.is_anonymous && user.app_metadata.providers?.includes('google');
        const profile = verified ? {id:user.id,name:String(user.user_metadata.full_name || user.email?.split('@')[0] || 'Your account'),email:user.email || '',createdAt:user.created_at} : null;
        if (!alive || token !== revision) return;
        setMusicOwner(profile?.id ?? null);
        setAuth({user:profile,loading:false});
      } catch {
        if (alive && token === revision) { setMusicOwner(null); setAuth({user:null,loading:false}); }
      }
    }
    void refresh();
    const subscription = client?.auth.onAuthStateChange(() => { window.setTimeout(() => void refresh(),0); });
    const focus = () => void refresh();
    window.addEventListener('focus',focus);
    const timer = window.setInterval(focus,60000);
    return () => { alive=false; revision++; subscription?.data.subscription.unsubscribe(); window.removeEventListener('focus',focus); clearInterval(timer); setMusicOwner(null); };
  },[]);
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
