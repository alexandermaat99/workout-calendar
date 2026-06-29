import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type GoalTypeWithActivityAndDistance = {
  id: number;
  goal_distance: number;
  goals: {
    name: string;
    goal_date: string;
  } | null;
  activity_types: {
    activity: string;
  } | null;
  distance_measurements: {
    measurement: string;
    conversion_ratio: number;
  } | null;
};

type GoalOption = {
  id: number;
  name: string | null;
  goal_date: string | null;
};

type ActivityOption = {
  id: number;
  activity: string | null;
};

type DistanceOption = {
  id: number;
  measurement: string | null;
  conversion_ratio: number | null;
};

export default async function Goals() {
  async function addGoal(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const goal = Number(formData.get("goal"));
    const activity = Number(formData.get("activity"));
    const distance_measurement = Number(formData.get("distance_measurement"));
    const goal_distance = Number(formData.get("goal_distance"));

    await supabase.from("goal_distance_activity_link").insert({
      goal,
      activity,
      distance_measurement,
      goal_distance,
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/goals");
  }

  //first create the client
  const supabase = await createClient();

  //query and build the data for GoalTypeWithActivityAndDistance
  const { data, error } = await supabase.from("goal_distance_activity_link")
    .select(`
      id,
      goal_distance, 
      goal(name, goal_date), 
      activity_types(activity), 
      distance_measurements(measurement,conversion_ratio)`);

  //query and build the data for goal

  //grab the error and data
  const goal = data as GoalTypeWithActivityAndDistance[] | null;

  // check for error

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  function conversion(ratio: number, distance: number) {
    return distance / ratio;
  }

  return (
    <main className="font-bold">
      <h1>Goals</h1>
      {goal?.map((item) => (
        <div key={item.id}>
          {item.goal?.name} {item.goal?.goal_date} for{" "}
          {item.activity_types?.activity}{" "}
          {item.distance_measurements?.measurement}{" "}
          {conversion(
            item.distance_measurements?.conversion_ratio!,
            item.goal_distance!,
          )}
        </div>
      ))}

      <form action={addGoal}>
        <input type="goal" placeholder="goal id" />
        <input type="activity" placeholder="activity id" />
        <input type="distance_measurement" placeholder="distance id" />
        <input type="goal_distance" placeholder="distance amount" />
        <button type="submit">add goal</button>
      </form>
    </main>
  );

  //return the data
}
