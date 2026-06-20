// src/components/ui/LoadingSpinner.jsx
export function LoadingSpinner({ size = "md", className = "" }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
    xl: "w-16 h-16 border-4",
  };

  return (
    <div
      className={`${sizes[size]} rounded-full border-blue-200 border-t-blue-500 animate-spin ${className}`}
    />
  );
}

export function FullPageLoader({ message = "Loading..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-blue-900" />
          <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin absolute top-0 left-0" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-base font-semibold text-gray-900 dark:text-white font-heading">
            RentEasy
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}