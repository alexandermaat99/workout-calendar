"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addEquipmentType(formData: FormData) {
  const supabase = await createClient();

  const equipment_type = String(formData.get("equipment_type")).toUpperCase();
  const activity_type = formData.get("activity");

  const { error } = await supabase
    .from("equipment_types")
    .insert({ equipment_type, activity_type });

  revalidatePath("/add-equipment-types");
}

export async function removeEquipmentType(id: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("equipment_types")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("add-equipment-types");
}
