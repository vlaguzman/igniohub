-- Applied manually via the Supabase SQL editor (D8 — no migration runner in repo).
create extension if not exists pgcrypto;

create table public.respondents (
  id         uuid primary key default gen_random_uuid(),
  full_name  text not null,
  email      text not null,
  created_at timestamptz not null default now()
);

create table public.assessment_results (
  id             uuid primary key default gen_random_uuid(),  -- IS the opaque token
  respondent_id  uuid not null references public.respondents(id) on delete cascade,
  stage          text not null,
  readiness      integer,                                     -- nullable (D6)
  answers        jsonb not null,                              -- raw EngineState
  result         jsonb not null,                              -- server ComputeResult
  engine_version text not null default '1',                   -- D18
  created_at     timestamptz not null default now()
);

create index assessment_results_respondent_id_idx on public.assessment_results (respondent_id);
create index assessment_results_created_at_idx    on public.assessment_results (created_at desc);

-- D5: RLS ON, ZERO POLICIES. service_role bypasses it; the browser's anon/
-- publishable key gets nothing. Do not add policies — there is no client path.
alter table public.respondents       enable row level security;
alter table public.assessment_results enable row level security;
