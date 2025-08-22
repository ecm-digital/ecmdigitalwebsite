-- Deduplicate projects and add uniqueness guard on name
-- Adjust the unique index if you want uniqueness per client as well
-- Safe to run multiple times

begin;

-- 1) Remove duplicate rows in projects (keep lowest id per name, case-insensitive)
with ranked as (
  select id,
         row_number() over (partition by lower(name) order by id) as rn
  from public.projects
)
delete from public.projects p
using ranked r
where p.id = r.id and r.rn > 1;

-- 2) Guard against future duplicates in projects by name
create unique index if not exists projects_name_unique_idx on public.projects (lower(name));

-- If you prefer uniqueness per client as well, drop the above and use:
-- create unique index if not exists projects_name_client_unique_idx on public.projects (lower(name), coalesce(client, ''));

commit;
