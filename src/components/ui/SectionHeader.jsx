// src/components/ui/SectionHeader.jsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SectionHeader({
  badge,
  title,
  highlight,
  subtitle,
  center = true,
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "mb-12",
        center && "text-center",
        className
      )}
    >
      {badge && (
        <span className="inline-block text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3 uppercase tracking-wider">
          {badge}
        </span>
      )}
      <h2 className="section-title mb-4">
        {title}{" "}
        {highlight && (
          <span className="gradient-text">{highlight}</span>
        )}
      </h2>
      {subtitle && (
        <p className={cn("section-subtitle", center && "mx-auto")}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}