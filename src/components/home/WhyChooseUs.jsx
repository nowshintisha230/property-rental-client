// src/components/home/WhyChooseUs.jsx
"use client";

import { motion } from "framer-motion";
import {
  TbShieldCheck,
  TbSearch,
  TbCreditCard,
  TbHeadset,
  TbStar,
  TbMapPin,
} from "react-icons/tb";

const features = [
  {
    icon: TbShieldCheck,
    title: "Verified Properties",
    description:
      "Every property is reviewed and approved by our admin team to ensure authenticity and quality.",
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: TbSearch,
    title: "Smart Search",
    description:
      "Advanced filters by location, type, price, and amenities help you find exactly what you need.",
    gradient: "from-purple-500 to-pink-500",
    bg: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    icon: TbCreditCard,
    title: "Secure Payments",
    description:
      "Powered by Stripe. Your payment data is encrypted and never stored on our servers.",
    gradient: "from-green-500 to-emerald-500",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  {
    icon: TbHeadset,
    title: "24/7 Support",
    description:
      "Our dedicated support team is available around the clock to help you with any issues.",
    gradient: "from-orange-500 to-yellow-500",
    bg: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    icon: TbStar,
    title: "Honest Reviews",
    description:
      "Real reviews from verified tenants help you make informed decisions before booking.",
    gradient: "from-yellow-500 to-amber-500",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  {
    icon: TbMapPin,
    title: "Prime Locations",
    description:
      "Properties in the most sought-after neighborhoods across major cities nationwide.",
    gradient: "from-red-500 to-pink-500",
    bg: "bg-red-50 dark:bg-red-900/20",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-white dark:bg-gray-950">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3 uppercase tracking-wider">
            Why RentEasy
          </span>
          <h2 className="section-title mb-4">
            The Smarter Way to{" "}
            <span className="gradient-text">Rent</span>
          </h2>
          <p className="section-subtitle">
            We combine technology, trust, and transparency to make renting as
            simple as possible.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="card-base p-6 group"
            >
              {/* Icon */}
              <div
                className={`inline-flex p-3.5 rounded-2xl ${feature.bg} mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon
                  className={`w-6 h-6 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`}
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                  }}
                />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-heading">
                {feature.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}