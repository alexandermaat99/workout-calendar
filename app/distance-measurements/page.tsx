import { createClient } from "@/lib/supabase/server";

type measurement = {
  measurement: string;
  conversion_ratio: number;
};

const supabase = await createClient();

const { data: measurementData, error: measurementsError } = await supabase
  .from("distance_measurements")
  .select("id, measurement, conversion_ratio");

export default async function addDistanceMeasurement() {
  return (
    <>
      {measurementData?.map((item) => (
        <div key={item.id}>{item.measurement}</div>
      ))}
      <form action="addDistanceMeasurement">
        <input
          type="number"
          required
          name="conversion_ratio"
          placeholder="x ft"
        />
        {" in a "}
        <input
          type="text"
          name="measurement"
          placeholder="Measurement"
          required
        />
      </form>
    </>
  );
}
