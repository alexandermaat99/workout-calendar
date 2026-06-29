import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { QueryData } from "@supabase/supabase-js";

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

    const { error } = await supabase
      .from("goal_distance_activity_link")
      .insert({
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

  const supabase = await createClient();

  const goalLinksQuery = supabase.from("goal_distance_activity_link").select(`
    id,
    goal_distance,
    goals:goal(name, goal_date),
    activity_types(activity),
    distance_measurements(measurement, conversion_ratio)
  `);

  type GoalLinks = QueryData<typeof goalLinksQuery>;

  const { data: goalLinks, error } = await goalLinksQuery;

  const { data: goalsData, error: goalsError } = await supabase
    .from("goals")
    .select("id, name, goal_date")
    .order("goal_date", { ascending: true });

  const { data: activitiesData, error: activitiesError } = await supabase
    .from("activity_types")
    .select("id, activity")
    .order("activity", { ascending: true });

  const { data: distanceData, error: distanceError } = await supabase
    .from("distance_measurements")
    .select("id, measurement, conversion_ratio")
    .order("measurement", { ascending: true });

  if (error || goalsError || activitiesError || distanceError) {
    return (
      <pre>
        {JSON.stringify(
          error || goalsError || activitiesError || distanceError,
          null,
          2,
        )}
      </pre>
    );
  }

  const goalOptions = goalsData as GoalOption[] | null;
  const activityOptions = activitiesData as ActivityOption[] | null;
  const distanceOptions = distanceData as DistanceOption[] | null;

  function conversion(ratio: number, distance: number) {
    return distance / ratio;
  }

  return (
    <main className="font-bold">
      <h1>Goals</h1>

      {goalLinks?.map((item) => (
        <div key={item.id}>
          {item.goals?.name} {item.goals?.goal_date} for{" "}
          {item.activity_types?.activity}{" "}
          {item.distance_measurements?.measurement}{" "}
          {item.distance_measurements?.conversion_ratio != null
            ? conversion(
                item.distance_measurements.conversion_ratio,
                item.goal_distance,
              )
            : null}
        </div>
      ))}

      <form action={addGoal}>
        <select name="goal" required>
          <option value="">Select goal</option>
          {goalOptions?.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.name}
              {goal.goal_date ? ` (${goal.goal_date})` : ""}
            </option>
          ))}
        </select>

        <select name="activity" required>
          <option value="">Select activity</option>
          {activityOptions?.map((activity) => (
            <option key={activity.id} value={activity.id}>
              {activity.activity}
            </option>
          ))}
        </select>

        <select name="distance_measurement" required>
          <option value="">Select distance measurement</option>
          {distanceOptions?.map((distance) => (
            <option key={distance.id} value={distance.id}>
              {distance.measurement}
            </option>
          ))}
        </select>

        <input
          name="goal_distance"
          type="number"
          step="any"
          min="0"
          placeholder="distance amount"
          required
        />

        <button type="submit">add goal</button>
      </form>
    </main>
  );
}
