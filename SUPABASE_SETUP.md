# Supabase Setup Guide for LogLens

## 1. Environment Variables
Ensure your `.env.local` contains the following (already created if you used my script):
```env
NEXT_PUBLIC_SUPABASE_URL=https://elmowznqlkwiksdqasff.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_x-VXSIQ2ozalh6-sX4wuyA_CfFHC1tV
```

## 2. Google OAuth Configuration
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Go to **APIs & Services > OAuth consent screen** and set it up (External).
4. Go to **Credentials > Create Credentials > OAuth client ID**.
5. Select **Web application**.
6. Add Authorized Redirect URIs: `https://elmowznqlkwiksdqasff.supabase.co/auth/v1/callback`
7. Copy the **Client ID** and **Client Secret**.
8. Go to your **Supabase Dashboard > Authentication > Providers > Google**.
9. Enable Google, paste the ID and Secret, and Save.

## 3. Database Schema (Optional but Recommended)
Run this SQL in your Supabase SQL Editor to create a `profiles` table that automatically syncs with your users:

```sql
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 4. Auth Callback
The system is configured to handle the auth callback at `/auth/callback`. This is used for:
- Google OAuth login completion
- Email verification links
- Password reset links
