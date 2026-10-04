import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

// Real embedded PostgreSQL engine. Mock only Supabase-owned auth/storage infrastructure.
// This does not replace validation against the Docker-based Supabase stack.
const db = new PGlite();
const a = "11111111-1111-4111-8111-111111111111";
const b = "22222222-2222-4222-8222-222222222222";
let checks = 0;
async function check(name, action) {
  await action();
  checks++;
  console.log("✓ " + name);
}
async function denied(sql, code) {
  await assert.rejects(db.exec(sql), (error) => error.code === code);
}
await db.exec(`
create role anon;
create role authenticated;
create role service_role bypassrls;
create schema auth;
create schema storage;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as
'select nullif(current_setting(''request.jwt.claim.sub'', true), '''')::uuid';
grant usage on schema public, auth, storage to anon, authenticated, service_role;
grant execute on function auth.uid() to anon, authenticated, service_role;
create table storage.buckets (
  id text primary key, name text not null, public boolean not null,
  file_size_limit bigint, allowed_mime_types text[]
);
create table storage.objects (
  id uuid primary key default gen_random_uuid(), bucket_id text, name text
);
alter table storage.objects enable row level security;
grant select, insert, update, delete on storage.objects to authenticated;
create function storage.foldername(text) returns text[] language sql immutable as
'select (string_to_array($1, ''/''))[1:array_length(string_to_array($1, ''/''), 1)-1]';
grant execute on function storage.foldername(text) to authenticated;
`);
const migrationFiles = (await readdir("supabase/migrations"))
  .filter((path) => path.endsWith(".sql"))
  .sort();
for (const file of migrationFiles)
  await db.exec(await readFile("supabase/migrations/" + file, "utf8"));
await db.exec(`
insert into auth.users values ('${a}'), ('${b}');
insert into public.profiles(owner_id, display_name) values ('${a}', 'A'), ('${b}', 'B');
insert into public.people(id, owner_id, display_name) values
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','${a}','Dad'),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','${b}','Mom');
insert into public.photos(id, owner_id, captured_at) values
('aaaaaaaa-0000-4000-8000-000000000001','${a}',now()),
('bbbbbbbb-0000-4000-8000-000000000001','${b}',now());
insert into public.memories(id, owner_id, photo_id, occurred_at, caption) values
('aaaaaaaa-0000-4000-8000-000000000002','${a}','aaaaaaaa-0000-4000-8000-000000000001',now(),'A memory'),
('bbbbbbbb-0000-4000-8000-000000000002','${b}','bbbbbbbb-0000-4000-8000-000000000001',now(),'B memory');
insert into public.books(id, owner_id, title, kind) values
('aaaaaaaa-0000-4000-8000-000000000003','${a}','Summer','monthly'),
('bbbbbbbb-0000-4000-8000-000000000003','${b}','Winter','monthly');
insert into public.jobs(owner_id, kind, idempotency_key) values ('${a}','pdf_export','sample');
insert into public.subscriptions(owner_id, provider, tier, status) values ('${a}','apple','free','active');
`);
await check("all thirteen public tables have RLS", async () => {
  const { rows } = await db.query(
    "select count(*)::int as total from pg_tables where schemaname='public' and rowsecurity",
  );
  assert.equal(rows[0].total, 13);
});
await check("media bucket is private", async () => {
  const { rows } = await db.query(
    "select public from storage.buckets where id='memories'",
  );
  assert.equal(rows[0].public, false);
});
await db.exec("set role anon");
await check(
  "anonymous users cannot read or write personal tables",
  async () => {
    await denied("select * from public.memories", "42501");
    await denied(
      `insert into public.people(owner_id,display_name) values ('${a}','Intruder')`,
      "42501",
    );
  },
);
await db.exec("reset role; set role authenticated");
await db.exec(`select set_config('request.jwt.claim.sub','${a}',false)`);
await check("owner reads only their memories", async () => {
  const { rows } = await db.query("select caption from public.memories");
  assert.deepEqual(rows, [{ caption: "A memory" }]);
});
await check("owner creates and updates own person", async () => {
  await db.exec(
    `insert into public.people(owner_id,display_name) values ('${a}','Friend')`,
  );
  await db.exec(
    "update public.people set display_name='Dad updated' where id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'",
  );
  const { rows } = await db.query(
    "select display_name from public.people where id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'",
  );
  assert.equal(rows[0].display_name, "Dad updated");
});
await check("cross-owner updates and deletes affect no records", async () => {
  const update = await db.query(
    "update public.memories set caption='Hacked' where id='bbbbbbbb-0000-4000-8000-000000000002'",
  );
  const remove = await db.query(
    "delete from public.people where id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'",
  );
  assert.equal(update.affectedRows, 0);
  assert.equal(remove.affectedRows, 0);
});
await check("owner cannot reassign ownership", async () => {
  await denied(
    `update public.people set owner_id='${b}' where id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'`,
    "42501",
  );
});
await check("owner cannot insert under another account", async () => {
  await denied(
    `insert into public.people(owner_id,display_name) values ('${b}','Intruder')`,
    "42501",
  );
});
await check("cloud photo creation is denied before opt-in", async () => {
  await denied(
    `insert into public.photos(owner_id,captured_at) values ('${a}',now())`,
    "42501",
  );
});
await check("media upload is denied before opt-in", async () => {
  await denied(
    `insert into storage.objects(bucket_id,name) values ('memories','${a}/sample.jpg')`,
    "42501",
  );
});
await db.exec(
  `update public.profiles set cloud_backup_enabled=true where owner_id='${a}'`,
);
await check("selected cloud photo succeeds after opt-in", async () => {
  await db.exec(
    `insert into public.photos(owner_id,captured_at,storage_path) values ('${a}',now(),'${a}/sample.jpg')`,
  );
});
await check("cross-owner photo paths are rejected", async () => {
  await denied(
    `insert into public.photos(owner_id,captured_at,storage_path) values ('${a}',now(),'${b}/sample.jpg')`,
    "23514",
  );
});
await check("cross-owner photo/person associations are rejected", async () => {
  await denied(
    `insert into public.photo_people values ('${a}','aaaaaaaa-0000-4000-8000-000000000001','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb')`,
    "23503",
  );
});
await check("cross-owner memory photo associations are rejected", async () => {
  await denied(
    `insert into public.memories(owner_id,photo_id,occurred_at,caption) values ('${a}','bbbbbbbb-0000-4000-8000-000000000001',now(),'Bad')`,
    "23503",
  );
});
await check("cross-owner memory/person associations are rejected", async () => {
  await denied(
    `insert into public.memory_people values ('${a}','aaaaaaaa-0000-4000-8000-000000000002','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb')`,
    "23503",
  );
});
await check("cross-owner book/page associations are rejected", async () => {
  await denied(
    `insert into public.book_pages(owner_id,book_id,memory_id,page_number,template) values ('${a}','aaaaaaaa-0000-4000-8000-000000000003','bbbbbbbb-0000-4000-8000-000000000002',1,'full_bleed')`,
    "23503",
  );
});
await check("own book page can be created", async () => {
  await db.exec(
    `insert into public.book_pages(owner_id,book_id,memory_id,page_number,template) values ('${a}','aaaaaaaa-0000-4000-8000-000000000003','aaaaaaaa-0000-4000-8000-000000000002',1,'full_bleed')`,
  );
});
await check("caption length is enforced", async () => {
  await denied("update public.memories set caption=repeat('x',281)", "23514");
});
await check("users cannot forge subscription or worker state", async () => {
  await denied("update public.subscriptions set tier='plus'", "42501");
  await denied("update public.jobs set status='completed'", "42501");
});
await check(
  "media upload and replacement succeed only in owner's folder",
  async () => {
    await db.exec(
      `insert into storage.objects(bucket_id,name) values ('memories','${a}/sample.jpg')`,
    );
    await db.exec(
      `update storage.objects set name='${a}/new.jpg' where name='${a}/sample.jpg'`,
    );
    await denied(
      `update storage.objects set name='${b}/stolen.jpg' where name='${a}/new.jpg'`,
      "42501",
    );
    await denied(
      `insert into storage.objects(bucket_id,name) values ('memories','${b}/stolen.jpg')`,
      "42501",
    );
  },
);
await db.exec(`select set_config('request.jwt.claim.sub','${b}',false)`);
await check("another user cannot read or delete private media", async () => {
  const { rows } = await db.query("select * from storage.objects");
  assert.equal(rows.length, 0);
  const result = await db.query("delete from storage.objects");
  assert.equal(result.affectedRows, 0);
});
await db.exec("reset role");
await check("account deletion cascades personal data", async () => {
  await db.exec(`delete from auth.users where id='${a}'`);
  const { rows } = await db.query(
    `select count(*)::int as total from public.memories where owner_id='${a}'`,
  );
  assert.equal(rows[0].total, 0);
});
await db.close();
console.log(`Passed ${checks} PostgreSQL ownership and privacy checks.`);
