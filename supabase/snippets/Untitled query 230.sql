create policy "allow insert equipment_types"
on public.equipment_types
for insert
to anon, authenticated
with check (true);

create policy "allow update equipment_types"
on public.equipment_types
for update
to anon, authenticated
using (true)
with check (true);

create policy "allow delete equipment_types"
on public.equipment_types
for delete
to anon, authenticated
using (true);