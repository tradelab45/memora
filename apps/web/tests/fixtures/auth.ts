import type { BrowserContext } from '@playwright/test';
export async function authenticate(context:BrowserContext,owner='alice') {
  const response=await context.request.get(`http://127.0.0.1:54329/__session/${owner}`);
  const session=await response.json();
  await context.addCookies([{name:'sb-127-auth-token',value:'base64-'+Buffer.from(JSON.stringify(session)).toString('base64url'),url:'http://127.0.0.1:3100',sameSite:'Lax'}]);
}
