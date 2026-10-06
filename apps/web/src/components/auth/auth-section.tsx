'use client';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Music2 } from 'lucide-react';
import { useUser } from '@/lib/auth';
import { GoogleSignIn } from './google-sign-in';
import './auth.css';
export function AuthSection() {
  const user = useUser();
  return <section id="sign-in" className="auth-landing-section" aria-labelledby="auth-section-title"><div className="auth-section-container">
    <div className="auth-section-info"><p className="auth-section-badge">YOUR STORY STARTS HERE</p><h2 id="auth-section-title" className="auth-section-heading">The moments are yours.<br/><em>Make them a book.</em></h2><p className="auth-section-subhead">Choose your photographs, add the words only you could write, and give every chapter its own soundtrack.</p><div className="auth-guarantees-list"><div className="guarantee-item"><ShieldCheck size={20}/><span>Your photos stay in this browser</span></div><div className="guarantee-item"><Music2 size={20}/><span>One song for the book, or one for each memory</span></div></div></div>
    <div className="auth-card-wrapper"><div className="auth-tilt-card"><div className="card-inner-content"><div className="card-top-row"><span className="brand-text">MEMORA</span><span className="card-mode-pill">{user?'Signed in':'Your private collection'}</span></div><div className="guest-login-body"><div className="guest-intro"><h3 className="guest-title">{user?`Welcome, ${user.name.split(' ')[0]}.`:'Keep the feeling.'}</h3><p className="guest-desc">{user?'Your next chapter is waiting.':'Sign in before creating your first memory.'}</p></div>{user?<Link href="/studio" className="card-primary-cta">Open your library <ArrowRight size={18}/></Link>:<GoogleSignIn/>}<p className="auth-message">Save a backup from your library to keep a copy outside this browser.</p></div></div></div></div>
  </div></section>;
}
