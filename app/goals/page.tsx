import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// import the proper libraries

type GoalOption = {
  id: number;
  name: string | null;
  goal_date: string | null;
};
// define the GoalOption type to be used
// when we query the Goal table for
// which. goals to chose from

type ActivityOption = {
  id: number;
  activity: string | null;
};
// same for activity

type DistanceOption = {
  id: number;
  measurement: string | null;
  conversion_ratio: number | null;
};
// same for distance

type GoalLinkRow = {
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
// but this type we're using to display the goals from the goal activity link table

export default async function Goals() {
  // this is the main function essentially creating the goals page
  async function addGoal(formData: FormData) {
    // the add goal function, it takes in the form data and inserts it into the database
    "use server";
    // using server not client

    const supabase = await createClient();
    // establish the connection using createClient

    const goal = Number(formData.get("goal"));
    const activity = Number(formData.get("activity"));
    const distance_measurement = Number(formData.get("distance_measurement"));
    const goal_distance = Number(formData.get("goal_distance"));
    // we establish our constants using the data from the form, we grab them based on the name of the select field
    // type cast them to numbers

    const { error } = await supabase
      .from("goal_distance_activity_link")
      .insert({
        goal,
        activity,
        distance_measurement,
        goal_distance,
      });
    // attempt an insert and collect the error

    if (error) {
      throw new Error(error.message);
    }
    // if there was an error to collect, we display it

    revalidatePath("/goals");
    // rerender to show the new inserted values
  }

  const supabase = await createClient();
  // we're outside the add function, we establish a connection, since we're outside the function, no connection
  // is active

  const { data: goalLinksData, error } = await supabase.from(
    "goal_distance_activity_link",
  ).select(`
      id,
      goal_distance,
      goals:goal(name, goal_date),
      activity_types(activity),
      distance_measurements(measurement, conversion_ratio)
    `);
  // we query the database, it will return data and error, data gets assigned to goalLinksData

  const goalLinks = goalLinksData as unknown as GoalLinkRow[] | null;
  // defining a const called goalLinks which is an array? or null? Lost here
  // we take goalLinksData which is the data from the query, we build it into an array? or it's null

  const { data: goalsData, error: goalsError } = await supabase
    .from("goals")
    .select("id, name, goal_date")
    .order("goal_date", { ascending: true });
  // we grab the goalsData

  const { data: activitiesData, error: activitiesError } = await supabase
    .from("activity_types")
    .select("id, activity")
    .order("activity", { ascending: true });
  // we grab the activitiesData

  const { data: distanceData, error: distanceError } = await supabase
    .from("distance_measurements")
    .select("id, measurement, conversion_ratio")
    .order("measurement", { ascending: true });
  // we grab the distanceData

  //grabbing these to be able to display the goals?

  if (error || goalsError || activitiesError || distanceError) {
    // if any of the queries errored out, we display the json of the error
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
  // we take all the data from the queries and put them into arrays that we will use to display
  // the available options in the form

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
        <select name="goal" required defaultValue="">
          <option value="" disabled>
            Select goal
          </option>
          {goalOptions?.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.name}
              {goal.goal_date ? ` (${goal.goal_date})` : ""}
            </option>
          ))}
        </select>

        <select name="activity" required defaultValue="">
          <option value="" disabled>
            Select activity
          </option>
          {activityOptions?.map((activity) => (
            <option key={activity.id} value={activity.id}>
              {activity.activity}
            </option>
          ))}
        </select>

        <select name="distance_measurement" required defaultValue="">
          <option value="" disabled>
            Select distance measurement
          </option>
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
