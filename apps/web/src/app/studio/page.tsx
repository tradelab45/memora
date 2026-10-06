import { redirect } from 'next/navigation';
import { StoryStudio } from '@/components/studio/story-studio';
import { AuthBoundary } from '@/components/auth/auth-boundary';
import { serverAuth } from '@/lib/supabase/server';
export const metadata={title:'Your library',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<{view?:string}>}) {
  const params=await searchParams;
  const view=params.view==='people'||params.view==='book'?params.view:'memories';
  const client=await serverAuth();
  const result=await client?.auth.getUser().catch(()=>null);
  const user=result?.data.user;
  if(!user||result?.error||user.is_anonymous||!user.app_metadata.providers?.includes('google')) redirect(`/signin?next=${encodeURIComponent(`/studio?view=${view}`)}`);
  return <AuthBoundary userId={user.id}><StoryStudio userId={user.id} initialView={view}/></AuthBoundary>;
}
