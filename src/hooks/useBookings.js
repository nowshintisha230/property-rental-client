// src/hooks/useBookings.js
"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

export function useTenantBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const fetchBookings = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/bookings/tenant?page=${page}&limit=10`
      );
      setBookings(res.data.data.bookings);
      setPagination(res.data.data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, pagination, refetch: fetchBookings };
}

export function useOwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const fetchBookings = useCallback(async (page = 1, status = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (status) params.append("status", status);
      const res = await axiosInstance.get(`/bookings/owner?${params}`);
      setBookings(res.data.data.bookings);
      setPagination(res.data.data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, pagination, refetch: fetchBookings };
}