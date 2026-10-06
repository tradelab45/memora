import type {NextConfig} from 'next';
let authOrigin='';
try { if(process.env.NEXT_PUBLIC_SUPABASE_URL) authOrigin=new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin; } catch { /* Missing configuration leaves accounts unavailable. */ }
const csp=["default-src 'self'",`script-src 'self' 'unsafe-inline'${process.env.NODE_ENV==='development'?" 'unsafe-eval'":''}`,"style-src 'self' 'unsafe-inline'","img-src 'self' data: blob:","font-src 'self'","media-src 'self' blob:",`connect-src 'self' ${authOrigin}`.trim(),"worker-src 'self' blob:","object-src 'none'","base-uri 'self'","frame-ancestors 'none'","form-action 'self'"].join('; ');
const nextConfig:NextConfig={reactStrictMode:true,poweredByHeader:false,async headers(){return [{source:'/(.*)',headers:[{key:'Content-Security-Policy',value:csp},{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},{key:'X-Frame-Options',value:'DENY'}]}];}};
export default nextConfig;
