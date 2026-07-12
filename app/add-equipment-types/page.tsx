//import libraries
import { createClient } from "@/lib/supabase/server";
import {
  addEquipmentType,
  removeEquipmentType,
} from "@/app/add-equipment-types/actions";
import DeleteEquipmentTypeButton from "./DeleteEquipmentTypeButton";

//establish types
type ActivityOption = {
  id: number;
  activity: string | null;
};

type EquipmentLinkRow = {
  id: number;
  equipment_type: string;
  activity_types: { activity: string };
};

//export main function
export default async function AddEquipmentTypes() {
  //create supabase client
  const supabase = await createClient();

  // grab the data to display the current goals
  const { data: equipmentLinksData, error } = await supabase
    .from("equipment_types")
    .select(`id, equipment_type,activity_types(activity)`);
  //put the returned data into a const

  // grab the data to display options
  const { data: activitiesData, error: activitiesError } = await supabase
    .from("activity_types")
    .select("id, activity")
    .order("activity", { ascending: true });

  // handle errors
  if (error || activitiesError) {
    return <pre>{JSON.stringify(error || activitiesError, null, 2)}</pre>;
  }

  // put the other returned data into their consts
  const activityOptions = activitiesData as ActivityOption[] | null;
  const equipmentLinks = equipmentLinksData as unknown as
    | EquipmentLinkRow[]
    | null;

  //return the actual page to render
  return (
    <main className="font-bold">
      <div className="mb-5">
        <div className="flex">Equipment Types for Activity</div>

        {equipmentLinks?.map((item) => (
          <div className="flex" key={item.id}>
            {item.equipment_type} {"for"} {item.activity_types.activity}
            <div className="pl-4">
              <DeleteEquipmentTypeButton
                key={item.id}
                action={removeEquipmentType.bind(null, item.id)}
                equipmentId={item.id}
              />
            </div>
          </div>
        ))}
      </div>

      <form action={addEquipmentType}>
        <input
          name="equipment_type"
          type="text"
          placeholder="name of equipment"
        />

        <select name="activity" required defaultValue={""}>
          <option value="" disabled>
            select activity
          </option>

          {activityOptions?.map((activity) => (
            <option key={activity.id} value={activity.id}>
              {activity.activity}
            </option>
          ))}
        </select>

        <button type="submit">add equipment type</button>
      </form>
    </main>
  );
}
