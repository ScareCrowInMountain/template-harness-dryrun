-- Health probe table. Every table gets RLS enabled in the same migration that
-- creates it; a table without RLS is a CI failure (see db:lint / security.yml).
create table if not exists public.health_checks (
  id bigint generated always as identity primary key,
  note text not null default 'ok',
  created_at timestamptz not null default now()
);

alter table public.health_checks enable row level security;

-- Anyone (including anon) may read the probe row; nobody may write via the API.
create policy "health_checks_read_all"
  on public.health_checks for select
  using (true);
