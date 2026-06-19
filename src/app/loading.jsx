// src/app/loading.jsx
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-blue-900"></div>
          <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin absolute top-0 left-0"></div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-lg font-semibold text-gray-900 dark:text-white font-heading">
            RentEasy
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
}