// src/components/home/TrustedOwners.jsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Chip } from "@heroui/react";
import {
  TbShieldCheck,
  TbStar,
  TbBuildingSkyscraper,
} from "react-icons/tb";
import axiosInstance from "@/lib/axios";

function normalizePhoto(url) {
  if (!url || typeof url !== "string" || url.trim() === "") return null;
  // Fix common typo: i.ibb.co.com → i.ibb.co
  return url.replace(/^https?:\/\/i\.ibb\.co\.com\//, "https://i.ibb.co/");
}

export default function TrustedOwners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchOwners() {
      try {
        const res = await axiosInstance.get("/users/top-owners");
        const fetched = res.data?.data?.owners;

        if (!Array.isArray(fetched)) {
          throw new Error("Invalid owners response");
        }

        if (!cancelled) {
          setOwners(fetched);
          setError(false);
        }
      } catch (err) {
        console.error("Failed to fetch trusted owners:", err);
        if (!cancelled) {
          setOwners([]);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchOwners();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="section-padding bg-white dark:bg-gray-950">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">
            <TbShieldCheck className="w-4 h-4" />
            Verified Owners
          </span>
          <h2 className="section-title">
            Our <span className="gradient-text">Trusted Owners</span>
          </h2>
          <p className="section-subtitle">
            Meet our top-rated property owners with verified identities and
            excellent track records.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="card-base p-4 text-center animate-pulse w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] lg:w-[calc(25%-0.75rem)]"
              >
                <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-800 mx-auto mb-3" />
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded mx-auto mb-2" />
                <div className="h-2.5 w-16 bg-gray-200 dark:bg-gray-800 rounded mx-auto mb-3" />
                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Unable to load trusted owners. Please try again later.
          </p>
        ) : owners.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No trusted owners to show yet.
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {owners.map((owner, i) => {
              const seed = encodeURIComponent(owner.name || owner._id || "owner");
              const fixed = normalizePhoto(owner.photo);
              const avatarSrc =
                fixed ||
                `https://api.dicebear.com/7.x/avataaars/png?seed=${seed}&size=128`;

              return (
                <motion.div
                  key={owner._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="card-base p-4 text-center group hover:shadow-card-hover transition-all duration-300 w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] lg:w-[calc(25%-0.75rem)]"
                >
                  <div className="relative inline-block mb-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-500 bg-gray-100 dark:bg-gray-800">
                      <img
                        src={avatarSrc}
                        alt={owner.name || "Owner"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Final fallback if even the fixed URL fails
                          e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/png?seed=${seed}&size=128`;
                        }}
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                      <TbShieldCheck className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white font-heading line-clamp-1 mb-0.5">
                    {owner.name}
                  </h4>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">
                    {owner.location || "—"}
                  </p>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5">
                      <TbStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {owner.rating?.toFixed?.(1) ?? owner.rating ?? "—"}
                      </span>
                    </div>
                    <span className="text-gray-300 dark:text-gray-600">·</span>
                    <div className="flex items-center gap-0.5">
                      <TbBuildingSkyscraper className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {owner.propertiesCount ?? owner.properties ?? 0}
                      </span>
                    </div>
                  </div>

                  <Chip
                    size="sm"
                    variant="flat"
                    color={owner.badge === "Top Owner" ? "warning" : "success"}
                    className="text-[10px] h-5"
                  >
                    {owner.badge || "Verified"}
                  </Chip>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}