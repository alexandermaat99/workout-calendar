import { createClient } from "@/lib/supabase/server";
import { addEquipmentType } from "./actions";

type EquipmentTypeWithActivity = {
  id: number;
  equipment_type: string;
  activity_types: {
    activity: string;
  } | null;
};

type ActivityOption = {
  id: number;
  activity: string;
};

export default async function EquipmentTypesPage() {
  //first create the client
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("equipment_types")
    .select(`id, equipment_type, activity_types(activity)`);
  //grab the error and data
  const equipment = data as EquipmentTypeWithActivity[] | null;

  const { data: activityData, error: activityError } = await supabase
    .from("activity_types")
    .select("id, activity")
    .order("activity", { ascending: true });

  // check for error

  if (error || activityError) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  const activityOptions = activityData as ActivityOption[] | null;

  return (
    <main className="font-bold">
      <h1>Equipment Types</h1>
      {equipment?.map((item) => (
        <div key={item.id}>
          {item.equipment_type} for {item.activity_types?.activity}
        </div>
      ))}

      <form action={addEquipmentType}>
        <input
          name="equipment_type"
          type="text"
          required
          placeholder="Enter Equipment Type"
        />
        <select required defaultValue="" name="activity_type">
          <option value="" disabled>
            Select Activity
          </option>
          {activityOptions?.map((activity) => (
            <option key={activity.id} value={activity.id}>
              {activity.activity}
            </option>
          ))}
        </select>
        <button type="submit">Add Equipment Type</button>
      </form>
    </main>
  );

  //return the data
}
