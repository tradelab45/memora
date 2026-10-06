import {test,expect} from '@playwright/test';
import {authenticate} from './fixtures/auth';
test('a forged local profile never unlocks the studio',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('memora-user-session',JSON.stringify({id:'forged',provider:'google',name:'Fake user'})));
  await page.goto('/studio?view=book');
  await expect(page).toHaveURL(/\/signin\?next=/);
  await expect(page.getByRole('heading',{name:'A life worth keeping.'})).toBeVisible();
  await expect(page.locator('input[type=file]')).toHaveCount(0);
});
test('invalid OAuth callbacks stay signed out and cannot redirect off-site',async({page})=>{
  await page.goto('/auth/callback?code=invalid&next=https://example.com');
  await expect(page).toHaveURL(/\/signin\?error=callback/);
  await expect(page.locator('.auth-message[role="alert"]')).toContainText('Sign-in did not finish');
});
test('unconfigured Google sign-in is clearly unavailable',async({page})=>{
  test.skip(process.env.MEMORA_AUTH_TESTS==='1','This project exercises configured test authentication.');
  await page.goto('/signin');
  await expect(page.getByRole('button',{name:'Continue with Google'})).toBeDisabled();
  await expect(page.getByRole('status')).toContainText('being set up');
});
test('the server rejects an invented auth cookie',async({page,context})=>{
  await context.addCookies([{name:'sb-127-auth-token',value:'base64-'+Buffer.from(JSON.stringify({access_token:'invented',refresh_token:'invented',expires_at:9999999999,user:{id:'forged'}})).toString('base64url'),url:process.env.MEMORA_AUTH_TESTS==='1'?'http://127.0.0.1:3100':'http://127.0.0.1:3000'}]);
  await page.goto('/studio');
  await expect(page).toHaveURL(/\/signin/);
});
test('verified Google sessions open the library and sign out closes it',async({page,context})=>{
  test.skip(process.env.MEMORA_AUTH_TESTS!=='1','Requires isolated test Auth service.');
  await authenticate(context);
  await page.goto('/studio');
  await expect(page).toHaveURL(/\/studio/);
  await expect(page.getByRole('button',{name:'Open account'})).toBeVisible();
  await page.getByRole('button',{name:'Open account'}).click();
  await expect(page.getByRole('dialog')).toContainText('alice@example.test');
  await page.getByRole('button',{name:'Sign out',exact:true}).click();
  await expect(page).toHaveURL(/\/signin/);
  await page.goto('/studio');
  await expect(page).toHaveURL(/\/signin/);
});
