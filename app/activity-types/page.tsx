import { createClient } from "@/lib/supabse/server";
// anytime we want to access the database
// we need to create a client instance, which is done by calling the createClient function

export default async function ActivityTypesPage() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("activity_types").select();

    if (error) {
        return <pre>{JSON.stringify(error, null, 2)}</pre>;
    }

    return (
        <main style={{ padding: "24px" }}>
            <h1>Activity Types</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </main>
    );
}
