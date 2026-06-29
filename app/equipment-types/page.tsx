import { createClient } from "@/lib/supabase/server";
import ActivityCard from "@/components/ActivityCard";

export default async function EquipmentTypesPage() {
  //first create the client
  const supabase = await createClient();
  const { data, error } = await supabase.from("equipment_types").select();
  //grab the error and data

  // check for error

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  return (
    <main style={{ padding: "24px" }}>
      <h1>Equipment Types</h1>

      <div className="space-y-3 w-min text-center">
        {data?.map((item) => (
          <ActivityCard key={item.id} activity={item.equipment_type} />
        ))}
      </div>
    </main>
  );

  //return the data
}
