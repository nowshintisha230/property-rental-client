// src/app/(auth)/layout.jsx
import Link from "next/link";
import { TbBuildingEstate } from "react-icons/tb";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute top-1/3 right-0 w-64 h-64 rounded-full bg-white/5" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-sm">
              <TbBuildingEstate className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white font-heading">
              RentEasy
            </span>
          </Link>

          {/* Hero text */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight font-heading">
                Find Your Perfect
                <br />
                <span className="text-yellow-300">Dream Home</span>
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed max-w-md">
                Discover thousands of properties, connect with trusted owners,
                and book your next home with complete confidence.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { value: "10K+", label: "Properties" },
                { value: "50K+", label: "Happy Tenants" },
                { value: "99%", label: "Satisfaction" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20"
                >
                  <p className="text-2xl font-bold text-white font-heading">
                    {stat.value}
                  </p>
                  <p className="text-blue-200 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <p className="text-blue-100 text-sm italic leading-relaxed mb-3">
                &ldquo;RentEasy made finding my apartment so simple. I found the
                perfect place within days and the booking process was
                seamless!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-900">S</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Sarah Chen</p>
                  <p className="text-blue-200 text-xs">Verified Tenant</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-yellow-400 text-sm">
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-blue-200 text-sm">
            © {new Date().getFullYear()} RentEasy. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-white dark:bg-gray-950 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link
            href="/"
            className="flex items-center gap-2 mb-8 lg:hidden"
          >
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <TbBuildingEstate className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white font-heading">
              RentEasy
            </span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}