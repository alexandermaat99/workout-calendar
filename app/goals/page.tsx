import { createClient } from "@/lib/supabase/server";
import { addGoal, removeGoal } from "./actions";
import DeleteGoalButton from "./DeleteGoalButton";

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
// A row from goal_distance_activity_link plus the related joined records
// from goals, activity_types, and distance_measurements for display.

export default async function Goals() {
  // this is the main function essentially creating the goals page

  const supabase = await createClient();
  // we're outside the add function, since we're outside the function
  // Create a Supabase server client again for database queries in this request.

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
  // Tell TypeScript to treat the returned data as either:
  // - an array of GoalLinkRow objects, or
  // - null if no data was returned.
  // This does not change the actual data at runtime; it only changes the TypeScript type.

  const { data: goalsData, error: goalsError } = await supabase
    .from("goals")
    .select("id, name, goal_date")
    .order("goal_date", { ascending: true });
  // A single row from the goals table, used to populate the "goal" dropdown.

  const { data: activitiesData, error: activitiesError } = await supabase
    .from("activity_types")
    .select("id, activity")
    .order("activity", { ascending: true });
  // A single row from the activity_types table, used to populate the activity dropdown.

  const { data: distanceData, error: distanceError } = await supabase
    .from("distance_measurements")
    .select("id, measurement, conversion_ratio")
    .order("measurement", { ascending: true });
  // A single row from the distance_measurements table, used to populate the distance dropdown.

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
  // this is type casting

  // Assert the query results to the row shape we expect for each dropdown.
  // Each value can be either an array of rows or null.

  function conversion(ratio: number, distance: number) {
    return distance / ratio;
  }

  return (
    // the actual stuff that gets displayed
    <main className="font-bold">
      <h1>Goals</h1>
      <div className="mb-5">
        {" "}
        {goalLinks?.map((item) => (
          // if we have goalLinks, which we grabbed on line 97, we map them
          // and display their data, going a conversion on one of the values
          <div className="flex" key={item.id}>
            {item.goals?.name} {item.goals?.goal_date} for{" "}
            {item.activity_types?.activity}{" "}
            {item.distance_measurements?.measurement}{" "}
            {item.distance_measurements?.conversion_ratio != null
              ? conversion(
                  item.distance_measurements.conversion_ratio,
                  item.goal_distance,
                )
              : null}
            {/* <form className="pl-4" action={removeGoal.bind(null, item.id)}> */}
            {/* we cannot just do action{removeGoal(item.id) because 
                when the page renders, removeGoal would happen instantly} */}
            {/* function () {return removeGoal(item.id);} */}
            {/* bind essentially builds this function so it doesn't run until the user
              hits the delete button */}
            <div className="pl-4">
              {" "}
              <DeleteGoalButton
                action={removeGoal.bind(null, item.id)}
                goalName={item.goals?.name}
              />
            </div>
            {/* </form> */}
          </div>
        ))}
      </div>

      {/* here we build data that we're submitting in the form */}
      <form action={addGoal}>
        <select name="goal" required defaultValue="">
          <option value="" disabled>
            Select goal
          </option>
          {/* if we have those goal options, grabbed on line 103, then we map them as the options */}
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
