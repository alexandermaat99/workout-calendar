// import the correct libraries
import { createClient } from '@/lib/supabse/server';
import { revalidatePath } from 'next/cache';
// we'll need to call this to tell the server to rerender info


//create async function for addActivityType that takes a formData type called FormData
async function addActivityType(formData:FormData) {
    "use server";

    const activity = formData.get("activity");

    if (typeof activity !== "string" || activity.trim() === "") {
        return;
    }
    // if the data we grabed isn't a string, or is blank, return

    const supabase = await createClient();

    const { error } = await supabase.from("activity_types").insert({
        activity: activity.trim(),
    })
    // we try to insert something into the activity column of activity_types, if an error is returned
    // we store is in the const called error, we don't care about data returning bc we're inserting data
    // not requesting it 

    // if we have an error, we want to do something about it
    if (error) { 
        console.error("Insert error:", error)
        return;
    }
    // we display the error and the leave the function 

    //if there's no error, and we've made it this far, we render the new insert with revalidate
    revalidatePath("/activity-types");

}

// now that the functions are created, we create what will be shown on the page
export default async functon ActivityTypesPage() {
    const supabase = await createClient();
// establish connection
    const { data, error } = await supabase.from("activity_types").select();
    // select * from activity_types

    return (
        <main style={{ padding: "24px" }}>
         <h1>Activity Types</h1>

            <form action={addActivityType} style={{ marginBottom: "24px"}} >
                <input type="text" name="activity" placeholder="Enter activity type" />
            <button type="submit">Add</button>
         </form>

         {error ? (
            <pre>{JSON.stringify(error, null, 2)}</pre>
         ) : (
            <pre>{JSON.stringify(data,null,2)}</pre>
         )}
        </main>

    );
}