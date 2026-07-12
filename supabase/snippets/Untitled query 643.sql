alter table public.activity_types enable row level security;
alter table public.equipment_types enable row level security;
alter table public.equipment enable row level security;
alter table public.distance_measurements enable row level security;
alter table public.distance_activity_link enable row level security;
alter table public.goals enable row level security;
alter table public.goal_distance_activity_link enable row level security;

create policy "allow read activity_types"
on public.activity_types
for select
to anon, authenticated
using (true);

create policy "allow read equipment_types"
on public.equipment_types
for select
to anon, authenticated
using (true);

create policy "allow read equipment"
on public.equipment
for select
to anon, authenticated
using (true);

create policy "allow read distance_measurements"
on public.distance_measurements
for select
to anon, authenticated
using (true);

create policy "allow read distance_activity_link"
on public.distance_activity_link
for select
to anon, authenticated
using (true);

create policy "allow read goals"
on public.goals
for select
to anon, authenticated
using (true);

create policy "allow read goal_distance_activity_link"
on public.goal_distance_activity_link
for select
to anon, authenticated
using (true);