'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { X, LockKeyhole } from 'lucide-react';
import { GoogleSignIn } from './google-sign-in';
import './auth.css';
export function AuthModal({open,onOpenChange}:{open:boolean;onOpenChange:(open:boolean)=>void}) {
  return <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal><Dialog.Overlay className="auth-dialog-overlay"/><Dialog.Content className="auth-dialog-card" data-lenis-prevent>
    <Dialog.Close asChild><button className="auth-card-close" aria-label="Close sign in dialog"><X size={20}/></button></Dialog.Close>
    <div className="auth-modal-header"><p className="auth-kicker">YOUR NEXT CHAPTER</p><Dialog.Title className="auth-title">A home for your memories.</Dialog.Title><Dialog.Description className="auth-desc">Sign in with Google to start your book. Your selected photos and songs are saved in this browser.</Dialog.Description></div>
    <GoogleSignIn/>
    <p className="auth-privacy-badge"><LockKeyhole size={18}/> Your library opens only after sign-in.</p>
  </Dialog.Content></Dialog.Portal></Dialog.Root>;
}
