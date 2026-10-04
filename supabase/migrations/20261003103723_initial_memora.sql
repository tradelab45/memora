-- MEMORA milestone 1. Personal content is owner-scoped; biometrics never enter this schema.
create table public.profiles (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 80),
  cloud_backup_enabled boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.people (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(owner_id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 1 and 80),
  created_at timestamptz not null default now(),
  unique (owner_id, id)
);
-- No reference photos, face templates, similarity vectors or stranger identification in cloud.
create table public.events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(owner_id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  starts_at timestamptz not null,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  check (ends_at is null or ends_at >= starts_at),
  unique (owner_id, id)
);
create table public.photos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(owner_id) on delete cascade,
  -- A cloud metadata UUID is distinct from the device-only photo-library locator.
  captured_at timestamptz not null,
  storage_path text,
  width integer check (width > 0),
  height integer check (height > 0),
  created_at timestamptz not null default now(),
  check (storage_path is null or split_part(storage_path, '/', 1) = owner_id::text),
  unique (owner_id, id)
);
create table public.photo_people (
  owner_id uuid not null,
  photo_id uuid not null,
  person_id uuid not null,
  primary key (owner_id, photo_id, person_id),
  foreign key (owner_id, photo_id) references public.photos(owner_id, id) on delete cascade,
  foreign key (owner_id, person_id) references public.people(owner_id, id) on delete cascade
);
create table public.memories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(owner_id) on delete cascade,
  photo_id uuid not null,
  event_id uuid,
  occurred_at timestamptz not null,
  title text check (char_length(title) <= 120),
  caption text not null check (char_length(trim(caption)) between 1 and 280),
  favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, id),
  foreign key (owner_id, photo_id) references public.photos(owner_id, id) on delete cascade,
  foreign key (owner_id, event_id) references public.events(owner_id, id)
);
create table public.memory_people (
  owner_id uuid not null,
  memory_id uuid not null,
  person_id uuid not null,
  primary key (owner_id, memory_id, person_id),
  foreign key (owner_id, memory_id) references public.memories(owner_id, id) on delete cascade,
  foreign key (owner_id, person_id) references public.people(owner_id, id) on delete cascade
);
create table public.books (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(owner_id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 120),
  kind text not null check (kind in ('monthly', 'person', 'trip', 'annual', 'custom')),
  created_at timestamptz not null default now(),
  unique (owner_id, id)
);
create table public.book_pages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  book_id uuid not null,
  memory_id uuid,
  page_number integer not null check (page_number > 0),
  template text not null check (template in ('cover', 'full_bleed', 'portrait_story', 'two_photo', 'closing')),
  unique (book_id, page_number),
  foreign key (owner_id, book_id) references public.books(owner_id, id) on delete cascade,
  foreign key (owner_id, memory_id) references public.memories(owner_id, id) on delete cascade
);
create table public.caption_suggestions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  memory_id uuid not null,
  suggestion text not null check (char_length(suggestion) between 1 and 280),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  foreign key (owner_id, memory_id) references public.memories(owner_id, id) on delete cascade
);
create table public.consent_receipts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(owner_id) on delete cascade,
  purpose text not null check (purpose in ('cloud_backup', 'ai_caption', 'private_sharing', 'printing')),
  policy_version text not null,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz
);
-- Job state and entitlements are server-owned. Users may only read their own records.
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(owner_id) on delete cascade,
  book_id uuid,
  kind text not null check (kind in ('book_layout', 'pdf_export', 'caption_suggestion', 'print_order')),
  status text not null default 'queued' check (status in ('queued', 'running', 'completed', 'failed', 'cancelled')),
  progress integer not null default 0 check (progress between 0 and 100),
  idempotency_key text not null,
  created_at timestamptz not null default now(),
  unique (owner_id, idempotency_key),
  foreign key (owner_id, book_id) references public.books(owner_id, id) on delete cascade
);
create table public.subscriptions (
  owner_id uuid primary key references public.profiles(owner_id) on delete cascade,
  provider text not null check (provider in ('apple', 'google', 'stripe')),
  tier text not null check (tier in ('free', 'plus', 'family')),
  status text not null,
  valid_until timestamptz
);
create index people_owner on public.people(owner_id);
create index events_owner on public.events(owner_id);
create index photos_owner_date on public.photos(owner_id, captured_at desc);
create index memories_owner_date on public.memories(owner_id, occurred_at desc, id);
create index books_owner_date on public.books(owner_id, created_at desc);
create index book_pages_owner on public.book_pages(owner_id);
create index caption_suggestions_owner on public.caption_suggestions(owner_id);
create index consent_receipts_owner on public.consent_receipts(owner_id);
create index jobs_owner on public.jobs(owner_id);

-- Immutable creation fields; owner reassignment is also prevented by WITH CHECK.
create function public.touch_memory() returns trigger language plpgsql security invoker
set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke execute on function public.touch_memory() from public, anon, authenticated;
create trigger memories_updated before update on public.memories
for each row execute function public.touch_memory();

do $$
declare relation text;
begin
  foreach relation in array array[
    'profiles', 'people', 'events', 'photos', 'photo_people', 'memories',
    'memory_people', 'books', 'book_pages', 'caption_suggestions', 'consent_receipts',
    'jobs', 'subscriptions'
  ] loop
    execute format('alter table public.%I enable row level security', relation);
    execute format('revoke all on table public.%I from anon, authenticated', relation);
    execute format('grant select on table public.%I to authenticated', relation);
    execute format('grant all on table public.%I to service_role', relation);
    execute format(
      'create policy owner_read on public.%I for select to authenticated using ((select auth.uid()) = owner_id)',
      relation
    );
  end loop;
  foreach relation in array array[
    'profiles', 'people', 'events', 'photo_people', 'memories', 'memory_people',
    'books', 'book_pages'
  ] loop
    execute format('grant insert, update, delete on table public.%I to authenticated', relation);
    execute format(
      'create policy owner_insert on public.%I for insert to authenticated with check ((select auth.uid()) = owner_id)', relation
    );
    execute format(
      'create policy owner_update on public.%I for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id)', relation
    );
    execute format(
      'create policy owner_delete on public.%I for delete to authenticated using ((select auth.uid()) = owner_id)', relation
    );
  end loop;
end;
$$;
-- Cloud photo records require an explicit user opt-in. No service key in clients.
grant insert, update, delete on public.photos to authenticated;
create policy photo_insert on public.photos for insert to authenticated with check (
  (select auth.uid()) = owner_id and exists (
    select 1 from public.profiles p where p.owner_id = (select auth.uid()) and p.cloud_backup_enabled
  )
);
create policy photo_update on public.photos for update to authenticated
using ((select auth.uid()) = owner_id)
with check (
  (select auth.uid()) = owner_id and exists (
    select 1 from public.profiles p where p.owner_id = (select auth.uid()) and p.cloud_backup_enabled
  )
);
create policy photo_delete on public.photos for delete to authenticated using ((select auth.uid()) = owner_id);
-- Consent receipts and suggestions are written by a validated service workflow.
-- They remain read-only to clients; AI never silently overwrites a user caption.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('memories', 'memories', false, 20971520, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
create policy private_media_read on storage.objects for select to authenticated using (
  bucket_id = 'memories' and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy private_media_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'memories' and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (select 1 from public.profiles p where p.owner_id = (select auth.uid()) and p.cloud_backup_enabled)
);
create policy private_media_update on storage.objects for update to authenticated using (
  bucket_id = 'memories' and (storage.foldername(name))[1] = (select auth.uid())::text
) with check (
  bucket_id = 'memories' and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (select 1 from public.profiles p where p.owner_id = (select auth.uid()) and p.cloud_backup_enabled)
);
create policy private_media_delete on storage.objects for delete to authenticated using (
  bucket_id = 'memories' and (storage.foldername(name))[1] = (select auth.uid())::text
);
