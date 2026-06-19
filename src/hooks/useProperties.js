// src/hooks/useProperties.js
"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

export function useProperties(params = {}) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 1,
  });

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value);
        }
      });

      const res = await axiosInstance.get(
        `/properties?${queryParams.toString()}`
      );
      setProperties(res.data.data.properties);
      setPagination(res.data.data.pagination);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to fetch properties";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, error, pagination, refetch: fetchProperties };
}

export function useFeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get("/properties/featured");
        setProperties(res.data.data.properties);
      } catch {
        // Silent fail for homepage section
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { properties, loading };
}

export function useProperty(id) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const res = await axiosInstance.get(`/properties/${id}`);
        setProperty(res.data.data.property);
      } catch (err) {
        setError(err.response?.data?.message || "Property not found");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return { property, loading, error };
}