export default function TripInfoSkeleton() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-xl my-10 animate-pulse">
      <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
      <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded mb-2" />
      <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded mb-4" />

      <div className="flex flex-wrap gap-6">
        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}
