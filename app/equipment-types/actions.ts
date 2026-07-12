"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addEquipmentType(formData: FormData) {
  const supabase = await createClient();

  const equipment_type = String(formData.get("equipment_type"));
  const activity_type = Number(formData.get("activity_type"));

  const { error } = await supabase
    .from("equipment_types")
    .insert({ equipment_type, activity_type });

  if (error) throw new Error(error.message);

  revalidatePath("/equipment-types");
}
