import { createClient } from "@/lib/supabse/server";

export default async function EquipmentTypesPage() {
    //first create the client
    const supabase = await createClient();
    const { data, error } = await supabase.from("equipment_types").select("equipment_type, activity_type");
    //grab the error and data

    // check for error 

    if (error) {
        return <pre>{JSON.stringify(error, null, 2)}</pre>;
    }

    return (
        <main style={{ padding: "24px" }}>
            <h1>Equipment Types</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </main>
    );

    //return the data


}