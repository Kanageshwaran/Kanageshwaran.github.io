create extension if not exists "pgcrypto";

create table if not exists public.media_assets (
    id uuid primary key default gen_random_uuid (),
    bucket text not null,
    path text not null,
    public_url text not null,
    alt_text text,
    caption text,
    width int,
    height int,
    created_at timestamptz not null default now()
);

create unique index if not exists media_assets_bucket_path_uniq on public.media_assets (bucket, path);

create table if not exists public.profile (
    id uuid primary key default gen_random_uuid (),
    full_name text not null,
    hero_title text not null,
    hero_description text not null,
    about_title text not null default 'About Me',
    about_paragraph_1 text not null,
    about_paragraph_2 text,
    email text not null,
    resume_url text,
    profile_image_asset_id uuid,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists profile_email_idx on public.profile (email);

alter table public.profile
add constraint profile_image_fk foreign key (profile_image_asset_id) references public.media_assets (id) on delete set null;

create table if not exists public.social_links (
    id uuid primary key default gen_random_uuid (),
    label text not null,
    url text not null,
    icon text,
    sort_order int not null default 0,
    is_visible boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists social_links_sort_idx on public.social_links (sort_order);

create table if not exists public.subjects (
    id text primary key,
    name text not null,
    description text not null,
    icon text,
    sort_order int not null default 0,
    is_visible boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists subjects_sort_idx on public.subjects (sort_order);

create table if not exists public.courses (
    id text primary key,
    subject_id text not null references public.subjects (id) on delete cascade,
    name text not null,
    term text,
    description text,
    sort_order int not null default 0,
    is_visible boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists courses_subject_idx on public.courses (subject_id);

create index if not exists courses_sort_idx on public.courses (subject_id, sort_order);

create table if not exists public.course_tools (
    id uuid primary key default gen_random_uuid (),
    course_id text not null references public.courses (id) on delete cascade,
    tool text not null,
    sort_order int not null default 0
);

create index if not exists course_tools_course_idx on public.course_tools (course_id);

create table if not exists public.assignments (
    id uuid primary key default gen_random_uuid (),
    course_id text not null references public.courses (id) on delete cascade,
    title text not null,
    description text,
    assignment_type text,
    github_url text,
    demo_url text,
    report_url text,
    sort_order int not null default 0,
    is_visible boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists assignments_course_idx on public.assignments (course_id);

create index if not exists assignments_sort_idx on public.assignments (course_id, sort_order);

create table if not exists public.activities (
    id uuid primary key default gen_random_uuid (),
    title text not null,
    description text not null,
    start_date date,
    end_date date,
    sort_order int not null default 0,
    is_visible boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists activities_sort_idx on public.activities (sort_order);

create table if not exists public.contact_messages (
    id uuid primary key default gen_random_uuid (),
    name text not null,
    email text not null,
    subject text,
    message text not null,
    status text not null default 'new',
    created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);

create index if not exists contact_messages_status_idx on public.contact_messages (status);