-- =======================================================================
-- PBEL City Durgotsav 2026 - Master Supabase PostgreSQL DDL Schema
-- PBEL Sanskritik Samiti, Hyderabad
-- =======================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. SPONSORS TABLE
create table if not exists sponsors (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  logo_url text,
  tier text check (tier in ('Platinum', 'Gold', 'Silver', 'Food & Bhog', 'Cultural', 'Other')) default 'Gold',
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. CONTRIBUTION CATEGORIES (Fixed Seva Storefront)
create table if not exists contribution_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  fixed_amount decimal(10,2),
  description text,
  max_limit integer default 5,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Optional: If modifying existing table:
-- alter table contribution_categories add column if not exists max_limit integer default 5;
-- alter table contribution_categories add column if not exists is_active boolean default true;

-- 3. CONTRIBUTIONS TABLE (Donor CRM)
create table if not exists contributions (
  id uuid primary key default uuid_generate_v4(),
  contributor_name text not null,
  email text,
  phone text not null,
  flat_number text,
  amount decimal(10,2) not null,
  category_id uuid references contribution_categories(id) on delete set null,
  payment_id text,
  status text check (status in ('Pending', 'Success', 'Failed')) default 'Pending',
  is_name_visible boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. EVENTS TABLE (Dynamic Pujo Nirghanto & Stage Lineups)
create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  event_type text check (event_type in ('Nirghanto', 'Pratibimb')) default 'Nirghanto',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. VOLUNTEER CATEGORIES TABLE
create table if not exists volunteer_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. VOLUNTEER SLOTS TABLE
create table if not exists volunteer_slots (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references volunteer_categories(id) on delete cascade not null,
  slot_date date not null,
  total_capacity integer not null default 20,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. VOLUNTEER REGISTRATIONS TABLE
create table if not exists volunteer_registrations (
  id uuid primary key default uuid_generate_v4(),
  slot_id uuid references volunteer_slots(id) on delete cascade not null,
  full_name text not null,
  phone text not null,
  email text,
  flat_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. CULTURAL EVENINGS TABLE
create table if not exists cultural_evenings (
  id uuid primary key default uuid_generate_v4(),
  evening_date date not null unique,
  total_slots integer not null default 25,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. CULTURAL PERFORMANCES TABLE (Pratibimb Acts)
create table if not exists cultural_performances (
  id uuid primary key default uuid_generate_v4(),
  evening_id uuid references cultural_evenings(id) on delete cascade not null,
  performance_type text check (performance_type in ('Song', 'Dance', 'Skit', 'Instrumental', 'Recitation')) default 'Song',
  format text check (format in ('Solo 3-5 min', 'Duet 4-6 min', 'Group 5-8 min', 'Drama 15-20 min', 'Solo (3-5 mins)', 'Duet (4-6 mins)', 'Group (5-8 mins)', 'Drama (15-20 mins)')) default 'Solo (3-5 mins)',
  song_name text,
  participant_names text not null,
  contact_name text not null,
  phone text not null,
  flat_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. CAMPAIGNS & PROMOTIONS TABLE
create table if not exists campaigns (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  image_url text not null,
  redirect_link text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. ADMIN ROLES TABLE
create table if not exists admin_roles (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. INITIAL SEED DATA
-- Insert Primary Super Admin
insert into admin_roles (email) 
values ('raibatak@gmail.com')
on conflict (email) do nothing;

-- Insert Default Seva Categories
insert into contribution_categories (name, fixed_amount, description) values
('Sashti Pushpanjali Flowers & Bilva Patra', 501.00, 'Fresh marigold garlands, roses, and bilva leaves for Bodhon.'),
('Sashti Devi Bodhon Sweets & Prasad', 1501.00, 'Special Bengali mishti offerings for Bodhon rituals.'),
('Saptami Nabapatrika Pujo Samagri', 1100.00, 'Ceremonial items for Kola Bou Snan & Pravesh.'),
('Saptami Maha Bhog Seva', 2501.00, 'Sponsorship for afternoon Khichuri, Labra, and Payesh bhog.'),
('Ashtami 108 Lotuses (Pushpanjali & Sandhi)', 3100.00, '108 red lotuses offered during Sandhi Pujo.'),
('Sandhi Pujo 108 Earthen Lamps & Ghee', 2501.00, '108 sacred oil lamps lit during Sandhi Pujo conjunction.'),
('Kumari Puja Seva & Gift Hampers', 2100.00, 'Sponsorship of gift hampers and prasad for Kumari Puja.'),
('Ashtami Grand Maha Bhog Family Seva', 5001.00, 'Full family sponsorship for township-wide Maha Bhog feast.'),
('Nabami Maha Yajna & Havan Samagri', 2100.00, 'Ghee, samidha wood, and offerings for sacred Havan.'),
('Nabami Maha Bhog Seva', 5001.00, 'Special Pulao, Paneer, and Sweets for Maha Navami prasad.'),
('Dashami Sindoor Khela & Mishti Box', 1800.00, 'Pure vermilion and sweet boxes for Sindoor Khela.'),
('Shanti Jal & Visarjan Dhaaki Seva', 3501.00, 'Dhaaki and Dhunuchi accompaniment for immersion procession.'),
('Silver Patron - Sampoorna Pujo Seva', 11000.00, 'Family sankalp during Sandhi Pujo & VIP seating.'),
('Gold Patron - Maha Yajman Sponsorship', 25000.00, 'Principal sankalp for daily puja & prime stage acknowledgment.')
on conflict (name) do nothing;

-- Insert Default Volunteer Categories
insert into volunteer_categories (name) values
('Maha Bhog & Prasad Distribution'),
('Pujo Nirghanto & Purohit Seva'),
('Pratibimb Stage & Sound Team'),
('Pandal Flow & Senior Citizen Seva')
on conflict (name) do nothing;
