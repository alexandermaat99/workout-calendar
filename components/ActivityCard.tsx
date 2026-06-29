type ActivityCardProps = {
  activity: string;
};
// this is basically the model
// this is what we're going to feed into the componenet
// we define a new type called ActivityCardProps


// this is the component
export default function ActivityCard({ activity }: ActivityCardProps) {
// un destructured version
// export default function ActivityCard(props: ActivityCardProps) {
//   const activity = props.activity;
// }


  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-lg font-medium text-gray-900">{activity}</p>
    </div>
  );
}