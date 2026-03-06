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

insert into public.site_settings (setting_key, setting_value)
values
  ('institute_name', 'Priyadarshini Computer & Typewriting Institute, Shirol'),
  ('short_name', 'Priyadarshini Computer & Typewriting Institute'),
  ('location', 'Near Tahsildar Office main road - Shirol, Kolhapur'),
  ('whatsapp_number', '917558628660'),
  ('contact_phone', '+91 755 862 8660'),
  ('upi_id', '')
on conflict (setting_key) do nothing;

alter table public.student_registrations enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;

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
