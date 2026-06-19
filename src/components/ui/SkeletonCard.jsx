// src/components/ui/SkeletonCard.jsx
export function PropertyCardSkeleton() {
  return (
    <div className="card-base overflow-hidden">
      <div className="skeleton h-52 w-full rounded-none rounded-t-2xl" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="skeleton h-4 w-20 rounded-lg" />
          <div className="skeleton h-4 w-16 rounded-lg" />
        </div>
        <div className="skeleton h-6 w-3/4 rounded-lg" />
        <div className="skeleton h-4 w-1/2 rounded-lg" />
        <div className="skeleton h-4 w-full rounded-lg" />
        <div className="skeleton h-4 w-2/3 rounded-lg" />
        <div className="flex justify-between items-center pt-2">
          <div className="skeleton h-7 w-24 rounded-lg" />
          <div className="skeleton h-9 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="skeleton h-4 w-full rounded-lg" />
        </td>
      ))}
    </tr>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="card-base p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="skeleton h-4 w-24 rounded-lg" />
        <div className="skeleton h-10 w-10 rounded-xl" />
      </div>
      <div className="skeleton h-8 w-32 rounded-lg mb-2" />
      <div className="skeleton h-3 w-20 rounded-lg" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="card-base p-8 max-w-md">
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="skeleton h-24 w-24 rounded-full" />
        <div className="space-y-2 text-center">
          <div className="skeleton h-6 w-32 rounded-lg mx-auto" />
          <div className="skeleton h-4 w-48 rounded-lg mx-auto" />
        </div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="skeleton h-4 w-20 rounded-lg" />
            <div className="skeleton h-4 w-32 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}