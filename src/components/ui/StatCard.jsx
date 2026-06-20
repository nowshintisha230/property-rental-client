// src/components/ui/StatCard.jsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TbArrowRight, TbTrendingUp } from "react-icons/tb";
import { cn } from "@/lib/utils";

export default function StatCard({
  label,
  value,
  icon: Icon,
  color = "text-blue-600 dark:text-blue-400",
  bg = "bg-blue-50 dark:bg-blue-900/20",
  href,
  change,
  changeLabel,
  delay = 0,
}) {
  const content = (
    <div
      className={cn(
        "card-base p-5 hover:shadow-card-hover transition-all duration-300 h-full",
        href && "group cursor-pointer"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <div className={cn("p-2.5 rounded-xl", bg)}>
          <Icon className={cn("w-5 h-5", color)} />
        </div>
      </div>

      <p className="text-2xl font-bold text-gray-900 dark:text-white font-heading mb-2">
        {value}
      </p>

      {change !== undefined && (
        <div className="flex items-center gap-1">
          <TbTrendingUp className="w-3.5 h-3.5 text-green-500" />
          <p className="text-xs text-green-600 dark:text-green-400 font-medium">
            {change} {changeLabel || ""}
          </p>
        </div>
      )}

      {href && (
        <p className="text-xs text-blue-500 mt-2 flex items-center gap-1 group-hover:gap-2 transition-all">
          View all
          <TbArrowRight className="w-3 h-3" />
        </p>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {href ? <Link href={href}>{content}</Link> : content}
    </motion.div>
  );
}