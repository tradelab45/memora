import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
  testDir:'./tests', testMatch:/(auth|studio|music)\.spec\.ts/, workers:1, retries:0, reporter:'list',
  use:{baseURL:'http://127.0.0.1:3100',trace:'retain-on-failure'},
  projects:[{name:'desktop',use:{...devices['Desktop Chrome']}},{name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'}}],
  webServer:[
    {command:'node tests/fixtures/auth-server.mjs',url:'http://127.0.0.1:54329/health',reuseExistingServer:!process.env.CI},
    {command:'npm run dev -- --port 3100',url:'http://127.0.0.1:3100',reuseExistingServer:false,timeout:120000,env:{NEXT_PUBLIC_SUPABASE_URL:'http://127.0.0.1:54329',NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'test-fixture-publishable-key',NEXT_TELEMETRY_DISABLED:'1'}},
  ],
});
