// src/components/dashboard/admin/AdminTransactionsClient.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Avatar, Button } from "@heroui/react";
import {
  TbSearch,
  TbRefresh,
  TbCurrencyDollar,
  TbReceipt,
  TbX,
  TbTrendingUp,
} from "react-icons/tb";
import axiosInstance from "@/lib/axios";
import { TableRowSkeleton } from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import { formatCurrency, formatDateTime, debounce } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminTransactionsClient() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
    limit: 10,
  });
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchTransactions = useCallback(
    async (p = 1, s = "") => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: p, limit: 10 });
        if (s) params.append("search", s);
        const res = await axiosInstance.get(`/transactions?${params}`);
        const txs = res.data.data.transactions || [];
        setTransactions(txs);
        setPagination(res.data.data.pagination);

        // Calculate total from current page (approximate)
        if (p === 1) {
          const sum = txs.reduce((acc, t) => acc + (t.amount || 0), 0);
          setTotalRevenue(sum);
        }
      } catch {
        toast.error("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchTransactions(page, search);
  }, [fetchTransactions, page, search]);

  const debouncedSearch = useCallback(
    debounce((val) => {
      setSearch(val);
      setPage(1);
    }, 500),
    []
  );

  return (
    <div className="page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-description">
            All financial transactions processed through the platform
          </p>
        </div>
        <Button
          variant="bordered"
          size="sm"
          startContent={<TbRefresh className="w-4 h-4" />}
          onPress={() => fetchTransactions(page, search)}
          className="font-medium"
        >
          Refresh
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Total Transactions",
            value: pagination.total,
            icon: TbReceipt,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
          },
          {
            label: "Page Revenue",
            value: formatCurrency(totalRevenue),
            icon: TbCurrencyDollar,
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-50 dark:bg-green-900/20",
          },
          {
            label: "Avg per Transaction",
            value:
              transactions.length > 0
                ? formatCurrency(totalRevenue / transactions.length)
                : "$0",
            icon: TbTrendingUp,
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-50 dark:bg-purple-900/20",
          },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card-base p-4 flex items-center gap-3"
          >
            <div className={`p-2.5 rounded-xl ${item.bg} flex-shrink-0`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white font-heading">
                {item.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <TbSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
        <input
          type="text"
          placeholder="Search by ID, tenant, or property..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            debouncedSearch(e.target.value);
          }}
          className="input-base pl-11"
        />
        {searchInput && (
          <button
            onClick={() => {
              setSearchInput("");
              setSearch("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <TbX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card-base overflow-hidden">
        {loading ? (
          <div className="table-container">
            <table className="w-full">
              <thead className="table-head">
                <tr>
                  {["Transaction ID", "Tenant", "Property", "Owner", "Amount", "Date"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={6} />
                ))}
              </tbody>
            </table>
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            type="transactions"
            title="No Transactions Found"
            description={
              search
                ? `No transactions match "${search}".`
                : "No transactions have been recorded yet."
            }
          />
        ) : (
          <div className="table-container">
            <table className="w-full">
              <thead className="table-head">
                <tr>
                  {["Transaction ID", "Tenant", "Property", "Owner", "Amount", "Date"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                {transactions.map((tx, i) => (
                  <motion.tr
                    key={tx._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="table-row"
                  >
                    {/* Transaction ID */}
                    <td className="table-cell">
                      <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg">
                        {tx.transactionId ||
                          `TXN-${tx._id?.slice(-6).toUpperCase()}`}
                      </span>
                    </td>

                    {/* Tenant */}
                    <td className="table-cell">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          src={tx.tenantId?.photo}
                          name={
                            tx.tenantSnapshot?.name || tx.tenantId?.name
                          }
                          size="sm"
                          isBordered
                          color="primary"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[100px]">
                            {tx.tenantSnapshot?.name || tx.tenantId?.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-[100px]">
                            {tx.tenantSnapshot?.email ||
                              tx.tenantId?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Property */}
                    <td className="table-cell">
                      <p className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[130px]">
                        {tx.propertySnapshot?.title || tx.propertyId?.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate max-w-[130px]">
                        {tx.propertySnapshot?.location}
                      </p>
                    </td>

                    {/* Owner */}
                    <td className="table-cell">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[110px]">
                        {tx.ownerSnapshot?.name || tx.ownerId?.name}
                      </p>
                    </td>

                    {/* Amount */}
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        <TbCurrencyDollar className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(tx.amount)}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="table-cell">
                      <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatDateTime(tx.createdAt)}
                      </p>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {(pagination.page - 1) * pagination.limit + 1}–
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.total
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {pagination.total}
              </span>{" "}
              transactions
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="bordered"
                isDisabled={page <= 1}
                onPress={() => setPage((p) => p - 1)}
                className="font-medium"
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="bordered"
                isDisabled={page >= pagination.pages}
                onPress={() => setPage((p) => p + 1)}
                className="font-medium"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}