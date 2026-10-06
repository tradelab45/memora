'use client';
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { UserRound, LogOut, X } from 'lucide-react';
import { useUser, signOutUser } from '@/lib/auth';
import { AuthModal } from './auth-modal';
import './auth.css';
export function AuthToggle({className='',compact=false}:{className?:string;compact?:boolean}) {
  const user=useUser(); const [open,setOpen]=useState(false); const [error,setError]=useState(''); const [pending,setPending]=useState(false);
  async function signOut(){ setPending(true); setError(''); try { await signOutUser(); } catch(error){setError(error instanceof Error?error.message:'Please retry.');setPending(false);} }
  return <div className={`auth-toggle-root ${className}`}><button className={`auth-toggle-track ${compact?'is-compact':''} ${user?'is-signed-in':''}`} aria-label={user?'Open account':'Sign in to MEMORA'} aria-haspopup="dialog" onClick={()=>setOpen(true)}>{!compact&&<span className="auth-toggle-status-text">{user?'Account':'Sign in'}</span>}<span className="auth-toggle-knob" aria-hidden="true">{user?user.name.slice(0,1):<UserRound size={16}/>}</span></button>
  {user?<Dialog.Root open={open} onOpenChange={setOpen}><Dialog.Portal><Dialog.Overlay className="auth-dialog-overlay"/><Dialog.Content className="auth-dialog-card"><Dialog.Close asChild><button className="auth-card-close" aria-label="Close account"><X/></button></Dialog.Close><Dialog.Title className="auth-title">Your account</Dialog.Title><Dialog.Description className="auth-desc">{user.name}<br/>{user.email}</Dialog.Description><p className="auth-message">Your library is saved on this device. Signing out closes it; your saved files remain in this browser.</p><button className="dropdown-signout-btn" disabled={pending} onClick={()=>void signOut()}><LogOut size={18}/>{pending?'Signing out…':'Sign out'}</button>{error&&<p role="alert">{error}</p>}</Dialog.Content></Dialog.Portal></Dialog.Root>:<AuthModal open={open} onOpenChange={setOpen}/>}</div>;
}
