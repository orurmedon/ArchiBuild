-- Create a table for public profiles using Supabase Auth
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security!
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Projects Table
create table projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  owner_id uuid references auth.users not null
);

alter table projects enable row level security;

create policy "Users can view own projects." on projects
  for select using (auth.uid() = owner_id);

create policy "Users can insert own projects." on projects
  for insert with check (auth.uid() = owner_id);

create policy "Users can update own projects." on projects
  for update using (auth.uid() = owner_id);

create policy "Users can delete own projects." on projects
  for delete using (auth.uid() = owner_id);

-- Diagrams Table (JSONB storage for canvas state)
create table diagrams (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  project_id uuid references projects(id) on delete cascade not null,
  name text not null,
  content jsonb default '{}'::jsonb, -- React Flow nodes/edges
  thumbnail_url text
);

alter table diagrams enable row level security;

create policy "Users can view diagrams of own projects." on diagrams
  for select using (
    exists (
      select 1 from projects
      where projects.id = diagrams.project_id
      and projects.owner_id = auth.uid()
    )
  );

create policy "Users can insert diagrams to own projects." on diagrams
  for insert with check (
    exists (
      select 1 from projects
      where projects.id = diagrams.project_id
      and projects.owner_id = auth.uid()
    )
  );

create policy "Users can update diagrams of own projects." on diagrams
  for update using (
    exists (
      select 1 from projects
      where projects.id = diagrams.project_id
      and projects.owner_id = auth.uid()
    )
  );

create policy "Users can delete diagrams of own projects." on diagrams
  for delete using (
    exists (
      select 1 from projects
      where projects.id = diagrams.project_id
      and projects.owner_id = auth.uid()
    )
  );

-- Function to handle new user signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
