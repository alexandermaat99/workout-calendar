"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addGoal(formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name"));
  const goal_date = formData.get("goal_date");

  const { data, error } = await supabase
    .from("goals")
    .insert({ name, goal_date });

  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/goals");
}

export async function pluralize(word: string, count: number) {
  if (count > 1) return `${word}S`;
  if (count < 1) return `of a ${word}`;
  return word;
}

export async function addGoalActivity(formData: FormData) {
  // the add goal function, it takes in the form data and inserts it into the database
  "use server";
  // using server not client

  const supabase = await createClient();
  // Create a Supabase server client for database queries in this request.

  const goal = Number(formData.get("goal"));
  const activity = Number(formData.get("activity"));
  const distance_measurement = Number(formData.get("distance_measurement"));
  const goal_distance = Number(formData.get("goal_distance"));
  // we establish our constants using the data from the form, we grab them based on the name of the select field
  // type cast them to numbers
  const { data: measurementRow, error: measurementError } = await supabase
    .from("distance_measurements")
    .select("conversion_ratio")
    .eq("id", distance_measurement)
    .single();
  // we need the conversion ratio to record the proper goal_distance
  // we use the id that matches the distance_measurement

  if (measurementError) {
    throw new Error(measurementError.message);
  }

  if (measurementRow?.conversion_ratio == null) {
    throw new Error("Missing conversion ratio for this distance measuremnt");
  }

  //error validation

  const convertedGoalDistance = goal_distance * measurementRow.conversion_ratio;
  // we convert the goal_distance using the conversion_ratio

  const { error } = await supabase.from("goal_distance_activity_link").insert({
    goal,
    activity,
    distance_measurement,
    goal_distance: convertedGoalDistance,
  });
  // attempt an insert and collect the error

  if (error) {
    throw new Error(error.message);
  }
  // if there was an error to collect, we display it

  revalidatePath("/goals");
  // rerender to show the new inserted values
}

export async function removeGoal(id: number) {
  "use server";

  const supabase = await createClient();

  const { error } = await supabase
    .from("goal_distance_activity_link")
    .delete()
    .eq("id", id);
  //id is the value we're feeding into removeGoal
  // "id" is the column name in the table
  // we remove the goal_distance_actvity_link row where
  // the row's id matches the id we feed in

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/goals");
  // re render with the deleted row
}
