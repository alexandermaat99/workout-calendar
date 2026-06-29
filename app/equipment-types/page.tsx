import { createClient } from "@/lib/supabase/server";
// import ActivityCard from "@/components/ActivityCard";

export default async function EquipmentTypesPage() {
  //first create the client
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("equipment_types")
    .select(`id, equipment_type, activity_types(activity)`);
  //grab the error and data
  const equipment = data as EquipmentTypeWithActivity[] | null;

  // check for error

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  type EquipmentTypeWithActivity = {
    id: number;
    equipment_type: string;
    activity_types: {
      activity: string;
    } | null;
  };

  return (
    <main className="font-bold">
      <h1>Equipment Types</h1>
      {equipment?.map((item) => (
        <div key={item.id}>
          {item.equipment_type} for {item.activity_types?.activity}
        </div>
      ))}
    </main>
  );

  //return the data
}
