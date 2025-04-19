export default function SinglePlaceSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {/* صورة */}
      <div className="flex justify-center">
        <div className="w-[600px] h-[300px] bg-gray-300 rounded-lg" />
      </div>

      {/* اسم المكان و التقييم */}
      <div className="flex justify-between">
        <div className="w-32 h-5 bg-gray-300 rounded" />
        <div className="w-24 h-5 bg-gray-300 rounded" />
      </div>

      {/* عنوان المكان */}
      <div className="w-3/4 h-6 bg-gray-300 rounded" />

      {/* وصف */}
      <div className="space-y-2">
        <div className="w-full h-4 bg-gray-200 rounded" />
        <div className="w-full h-4 bg-gray-200 rounded" />
        <div className="w-5/6 h-4 bg-gray-200 rounded" />
      </div>

      {/* badges */}
      <div className="flex gap-3 mt-3">
        <div className="w-20 h-6 bg-gray-300 rounded-full" />
        <div className="w-24 h-6 bg-gray-300 rounded-full" />
      </div>

      {/* visiting hours + زر location */}
      <div className="flex gap-4 items-center">
        <div className="w-32 h-5 bg-gray-300 rounded" />
        <div className="w-28 h-10 bg-gray-300 rounded" />
      </div>

      {/* textarea */}
      <div className="w-[600px] h-24 bg-gray-200 rounded" />

      {/* زر submit */}
      <div className="w-32 h-10 bg-gray-300 rounded" />
    </div>
  );
}
