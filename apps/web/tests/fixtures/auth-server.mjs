// Test infrastructure only. This server is never imported by the application.
import http from 'node:http';
import crypto from 'node:crypto';
const sessions = new Map();
function session(owner) {
  const id=owner==='bob'?'22222222-2222-4222-8222-222222222222':'11111111-1111-4111-8111-111111111111';
  const user={id,aud:'authenticated',role:'authenticated',email:`${owner}@example.test`,created_at:'2026-01-01T00:00:00Z',app_metadata:{provider:'google',providers:['google']},user_metadata:{full_name:owner==='bob'?'Bob Test':'Alice Test'},identities:[{id,provider:'google'}],is_anonymous:false};
  const expires_at=Math.floor(Date.now()/1000)+3600;
  const encode=(value)=>Buffer.from(JSON.stringify(value)).toString('base64url');
  const body=encode({alg:'HS256',typ:'JWT'})+'.'+encode({sub:id,aud:'authenticated',role:'authenticated',exp:expires_at,iat:expires_at-3600});
  const token=body+'.'+crypto.createHmac('sha256','test-only-fixture-secret').update(body).digest('base64url');
  const result={access_token:token,refresh_token:`fixture-${owner}`,token_type:'bearer',expires_in:3600,expires_at,user};
  sessions.set(token,result);return result;
}
http.createServer((req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:3100');
  res.setHeader('Access-Control-Allow-Headers','authorization,apikey,content-type,x-client-info,x-supabase-api-version');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
  res.setHeader('Content-Type','application/json');
  if(req.url==='/health'){res.end('{"ok":true}');return;}
  if(req.url?.startsWith('/__session/')){res.end(JSON.stringify(session(req.url.split('/').pop()==='bob'?'bob':'alice')));return;}
  const current=sessions.get(req.headers.authorization?.replace(/^Bearer /,''));
  if(req.url==='/auth/v1/user'&&current){res.end(JSON.stringify(current.user));return;}
  if(req.url?.startsWith('/auth/v1/logout')&&current){sessions.delete(current.access_token);res.writeHead(204);res.end();return;}
  res.writeHead(401);res.end('{"code":"bad_jwt","message":"Invalid test session"}');
}).listen(54329,'127.0.0.1');
