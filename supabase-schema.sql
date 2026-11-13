-- Tok Bebek — Yeni Supabase Projesi Kurulum SQL
-- Yeni projenin SQL Editor'ına kopyalayıp çalıştırın

-- 1. profiles (zaten varsa atla, yoksa oluştur)
create table if not exists profiles (
  id uuid references auth.users primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text default 'user',
  created_at timestamptz default now()
);

-- 2. articles
create table articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null check (category in ('nutrition', 'development', 'health', 'safety')),
  image_url text,
  reading_time_min integer not null default 5,
  sources jsonb default '[]'::jsonb,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. recipes
create table recipes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  image_url text,
  age_min_months integer not null,
  age_max_months integer not null,
  prep_time_min integer not null default 15,
  cook_time_min integer not null default 15,
  servings integer not null default 1,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')) default 'easy',
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack', 'puree')),
  texture text not null check (texture in ('smooth', 'lumpy', 'chunky', 'finger')),
  is_freezable boolean default false,
  is_dairy_free boolean default false,
  is_gluten_free boolean default false,
  is_sugar_free boolean default false,
  health_tags text[] default '{}',
  nutritional_info jsonb default '{}'::jsonb,
  instructions text,
  is_published boolean default false,
  view_count integer default 0,
  save_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. recipe_ingredients
create table recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes(id) on delete cascade not null,
  name text not null,
  amount numeric not null,
  unit text not null,
  is_optional boolean default false,
  substitute text,
  "order" integer not null default 0
);

-- 5. saved_recipes
create table saved_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  recipe_id uuid references recipes(id) on delete cascade not null,
  notes text,
  created_at timestamptz default now(),
  unique(user_id, recipe_id)
);

-- 6. recipe_reviews
create table recipe_reviews (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes(id) on delete cascade not null,
  user_id uuid references auth.users,
  reviewer_name text,
  reviewer_email text,
  rating integer not null check (rating between 1 and 5),
  comment text,
  baby_age_at_review integer,
  is_approved boolean default false,
  edit_token uuid,
  admin_reply text,
  replied_at timestamptz,
  created_at timestamptz default now()
);

-- 7. babies
create table babies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  birth_date date not null,
  gender text not null check (gender in ('girl', 'boy')),
  allergies text[] default '{}',
  health_notes text,
  created_at timestamptz default now()
);

-- 8. newsletter_subscribers
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  baby_birth_date date,
  is_active boolean default true,
  subscribed_at timestamptz default now()
);

-- 9. view count fonksiyonu
create or replace function increment_view_count(recipe_slug text)
returns void language plpgsql security definer as $$
begin
  update recipes set view_count = view_count + 1 where slug = recipe_slug;
end;
$$;

-- 10. RLS politikaları
alter table recipes enable row level security;
alter table recipe_ingredients enable row level security;
alter table articles enable row level security;
alter table profiles enable row level security;
alter table recipe_reviews enable row level security;
alter table saved_recipes enable row level security;
alter table babies enable row level security;
alter table newsletter_subscribers enable row level security;

-- Yayınlanmış tarifler herkese açık
create policy "Yayınlanmış tarifler herkese açık"
  on recipes for select using (is_published = true);

-- Tarif malzemeleri herkese açık
create policy "Tarif malzemeleri herkese açık"
  on recipe_ingredients for select using (
    exists (select 1 from recipes where id = recipe_id and is_published = true)
  );

-- Yayınlanmış makaleler herkese açık
create policy "Yayınlanmış makaleler herkese açık"
  on articles for select using (is_published = true);

-- Profiller: kendi profilini görebilir
create policy "Kullanıcı kendi profilini görebilir"
  on profiles for select using (auth.uid() = id);

create policy "Kullanıcı kendi profilini güncelleyebilir"
  on profiles for update using (auth.uid() = id);

-- Yorumlar: herkese açık okuma
create policy "Yorumlar herkese açık"
  on recipe_reviews for select using (true);

create policy "Kullanıcı yorum ekleyebilir"
  on recipe_reviews for insert with check (true);
