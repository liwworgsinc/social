create schema if not exists private;

create or replace function private.touch_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;
revoke all on function private.touch_updated_at() from public, anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text, avatar_url text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.brands (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  name text not null, website_url text, audience text, call_to_action text,
  brand_voice text not null default 'professional', primary_color text not null default '#5b3df5',
  secondary_color text not null default '#171629', accent_color text not null default '#f3b63f', logo_path text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.websites (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  brand_id uuid references public.brands(id) on delete cascade, url text, content text,
  summary jsonb not null default '{}'::jsonb, last_scanned_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.posts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  brand_id uuid references public.brands(id) on delete set null, website_id uuid references public.websites(id) on delete set null,
  platform text not null check (platform in ('instagram','facebook','linkedin','x')),
  framework text not null default 'problem-solution', tone text not null default 'professional',
  headline text not null, body text not null, hashtags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft','saved','queued','published','failed')),
  scheduled_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.design_templates (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade,
  name text not null, slug text not null, category text not null default 'problem-solution',
  canvas_size text not null default 'square', config jsonb not null default '{}'::jsonb, is_public boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique nulls not distinct (user_id, slug)
);
create table public.designs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  brand_id uuid references public.brands(id) on delete set null, post_id uuid references public.posts(id) on delete set null,
  name text not null, canvas_size text not null default 'square', template_slug text,
  design_json jsonb not null default '{}'::jsonb, preview_path text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.scheduled_posts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  platform text not null check (platform in ('instagram','facebook','linkedin','x')),
  scheduled_at timestamptz not null, status text not null default 'pending' check (status in ('pending','processing','published','failed','cancelled')),
  external_post_id text, error_message text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(post_id)
);

create index brands_user_id_idx on public.brands(user_id);
create index websites_user_id_idx on public.websites(user_id);
create index posts_user_id_created_at_idx on public.posts(user_id, created_at desc);
create index designs_user_id_created_at_idx on public.designs(user_id, created_at desc);
create index designs_brand_id_idx on public.designs(brand_id);
create index designs_post_id_idx on public.designs(post_id);
create index posts_website_id_idx on public.posts(website_id);
create index scheduled_posts_user_id_time_idx on public.scheduled_posts(user_id, scheduled_at);

create trigger profiles_touch_updated_at before update on public.profiles for each row execute function private.touch_updated_at();
create trigger brands_touch_updated_at before update on public.brands for each row execute function private.touch_updated_at();
create trigger websites_touch_updated_at before update on public.websites for each row execute function private.touch_updated_at();
create trigger posts_touch_updated_at before update on public.posts for each row execute function private.touch_updated_at();
create trigger design_templates_touch_updated_at before update on public.design_templates for each row execute function private.touch_updated_at();
create trigger designs_touch_updated_at before update on public.designs for each row execute function private.touch_updated_at();
create trigger scheduled_posts_touch_updated_at before update on public.scheduled_posts for each row execute function private.touch_updated_at();

create or replace function private.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, display_name) values(new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))) on conflict(id) do nothing;
  return new;
end; $$;
revoke all on function private.handle_new_user() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.brands enable row level security;
alter table public.websites enable row level security;
alter table public.posts enable row level security;
alter table public.design_templates enable row level security;
alter table public.designs enable row level security;
alter table public.scheduled_posts enable row level security;

create policy profiles_select_own on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy profiles_update_own on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy brands_select_own on public.brands for select to authenticated using ((select auth.uid()) = user_id);
create policy brands_insert_own on public.brands for insert to authenticated with check ((select auth.uid()) = user_id);
create policy brands_update_own on public.brands for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy brands_delete_own on public.brands for delete to authenticated using ((select auth.uid()) = user_id);

create policy websites_select_own on public.websites for select to authenticated using ((select auth.uid()) = user_id);
create policy websites_insert_own on public.websites for insert to authenticated with check ((select auth.uid()) = user_id);
create policy websites_update_own on public.websites for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy websites_delete_own on public.websites for delete to authenticated using ((select auth.uid()) = user_id);

create policy posts_select_own on public.posts for select to authenticated using ((select auth.uid()) = user_id);
create policy posts_insert_own on public.posts for insert to authenticated with check ((select auth.uid()) = user_id);
create policy posts_update_own on public.posts for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy posts_delete_own on public.posts for delete to authenticated using ((select auth.uid()) = user_id);

create policy templates_select_public_or_own on public.design_templates for select to anon, authenticated using (is_public or (select auth.uid()) = user_id);
create policy templates_insert_own on public.design_templates for insert to authenticated with check ((select auth.uid()) = user_id and not is_public);
create policy templates_update_own on public.design_templates for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id and not is_public);
create policy templates_delete_own on public.design_templates for delete to authenticated using ((select auth.uid()) = user_id);

create policy designs_select_own on public.designs for select to authenticated using ((select auth.uid()) = user_id);
create policy designs_insert_own on public.designs for insert to authenticated with check ((select auth.uid()) = user_id);
create policy designs_update_own on public.designs for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy designs_delete_own on public.designs for delete to authenticated using ((select auth.uid()) = user_id);

create policy scheduled_select_own on public.scheduled_posts for select to authenticated using ((select auth.uid()) = user_id);
create policy scheduled_insert_own on public.scheduled_posts for insert to authenticated with check ((select auth.uid()) = user_id);
create policy scheduled_update_own on public.scheduled_posts for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy scheduled_delete_own on public.scheduled_posts for delete to authenticated using ((select auth.uid()) = user_id);

grant usage on schema public to anon, authenticated;
grant select on public.design_templates to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.brands, public.websites, public.posts, public.designs, public.scheduled_posts to authenticated;
grant insert, update, delete on public.design_templates to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('brand-assets','brand-assets',false,10485760,array['image/png','image/jpeg','image/webp','image/svg+xml'])
on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy brand_assets_select_own on storage.objects for select to authenticated using (bucket_id='brand-assets' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy brand_assets_insert_own on storage.objects for insert to authenticated with check (bucket_id='brand-assets' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy brand_assets_update_own on storage.objects for update to authenticated using (bucket_id='brand-assets' and (storage.foldername(name))[1]=(select auth.uid())::text) with check (bucket_id='brand-assets' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy brand_assets_delete_own on storage.objects for delete to authenticated using (bucket_id='brand-assets' and (storage.foldername(name))[1]=(select auth.uid())::text);

insert into public.design_templates(name,slug,category,canvas_size,config,is_public) values
('Electric Problem/Solution','electric-problem','problem-solution','square','{"background":"#4f35e8","accent":"#f3b63f","text":"#ffffff","layout":"split","badge":"PROBLEM → SOLUTION"}',true),
('Editorial Service Spotlight','editorial-service','service','portrait','{"background":"#f4efe7","accent":"#202020","text":"#202020","layout":"editorial","badge":"SERVICE SPOTLIGHT"}',true),
('Bold Offer','bold-offer','promotion','square','{"background":"#111111","accent":"#ffdd31","text":"#ffffff","layout":"bold","badge":"LIMITED OFFER"}',true),
('Local Community','local-community','local','portrait','{"background":"#0c5b4c","accent":"#ffcc74","text":"#ffffff","layout":"community","badge":"LOCAL BUSINESS"}',true),
('Clean Professional','clean-professional','professional','landscape','{"background":"#f7f8fc","accent":"#5b3df5","text":"#172033","layout":"clean","badge":"SMARTER SOLUTION"}',true),
('Luxury Minimal','luxury-minimal','luxury','square','{"background":"#141214","accent":"#c9a86a","text":"#f8f2e7","layout":"luxury","badge":"PREMIUM SERVICE"}',true)
on conflict(user_id,slug) do nothing;
