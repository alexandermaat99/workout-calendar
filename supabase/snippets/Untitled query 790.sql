grant usage on schema public to anon, authenticated;

grant select on table public.activity_types to anon, authenticated;
grant select on table public.equipment_types to anon, authenticated;
grant select on table public.equipment to anon, authenticated;
grant select on table public.distance_measurements to anon, authenticated;
grant select on table public.distance_activity_link to anon, authenticated;
grant select on table public.goals to anon, authenticated;
grant select on table public.goal_distance_activity_link to anon, authenticated;

grant insert, update, delete on table public.activity_types to anon, authenticated;
grant insert, update, delete on table public.equipment_types to anon, authenticated;
grant insert, update, delete on table public.equipment to anon, authenticated;
grant insert, update, delete on table public.distance_measurements to anon, authenticated;
grant insert, update, delete on table public.distance_activity_link to anon, authenticated;
grant insert, update, delete on table public.goals to anon, authenticated;
grant insert, update, delete on table public.goal_distance_activity_link to anon, authenticated;