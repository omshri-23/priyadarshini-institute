create table if not exists public.student_registrations (
  id bigint generated always as identity primary key,
  student_code text unique not null,
  student_name text not null,
  first_name text not null,
  middle_name text,
  last_name text not null,
  gender text not null,
  email text,
  contact_number text not null,
  parent_contact text,
  address text not null,
  highest_education text not null default '',
  selected_courses text not null,
  typing_options text not null default '',
  payment_status text not null default 'pending',
  admission_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  sender_name text not null,
  phone_number text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  setting_key text primary key,
  setting_value text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  id bigint generated always as identity primary key,
  username text unique not null,
  password_hash text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.site_settings (setting_key, setting_value)
values
  ('institute_name', 'Priyadarshini Computer & Typewriting Institute, Shirol'),
  ('short_name', 'Priyadarshini Computer and Typewriting Institute'),
  ('location', 'Main Branch: Near Tahsildar Office Main Road, Shirol, Kolhapur. Branch Campus: Bhaji Mandai, front of Hanuman Temple, Shirol.'),
  ('whatsapp_number', '917558628660'),
  ('contact_phone', '+91 755 862 8660'),
  ('contact_email', ''),
  ('upi_id', ''),
  ('upi_payee_name', 'Priyadarshini Institute'),
  ('upi_qr_image_url', ''),
  ('upi_payment_note', 'Admission fee payment')
on conflict (setting_key) do nothing;

insert into public.admin_users (username, password_hash, is_active)
values ('admin', '41e5653fc7aeb894026d6bb7b2db7f65902b454945fa8fd65a6327047b5277fb', true)
on conflict (username) do nothing;

alter table public.student_registrations enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "deny_anonymous_reads" on public.student_registrations;
create policy "deny_anonymous_reads"
on public.student_registrations
for select
to anon
using (false);

drop policy if exists "deny_anonymous_contact_reads" on public.contact_messages;
create policy "deny_anonymous_contact_reads"
on public.contact_messages
for select
to anon
using (false);

drop policy if exists "allow_public_settings_read" on public.site_settings;
create policy "allow_public_settings_read"
on public.site_settings
for select
to anon
using (true);

drop policy if exists "deny_anonymous_admin_reads" on public.admin_users;
create policy "deny_anonymous_admin_reads"
on public.admin_users
for select
to anon
using (false);
