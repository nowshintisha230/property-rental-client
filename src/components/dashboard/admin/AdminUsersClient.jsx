// src/components/dashboard/admin/AdminUsersClient.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Avatar,
  Button,
  Chip,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  TbSearch,
  TbRefresh,
  TbUsers,
  TbShield,
  TbEdit,
  TbX,
} from "react-icons/tb";
import axiosInstance from "@/lib/axios";
import { TableRowSkeleton } from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate, debounce } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

// "admin" intentionally excluded — admin role can no longer be
// assigned from this UI. Existing admin accounts (if any) are
// unaffected; this only limits what this picker offers going forward.
const ROLES = ["tenant", "owner"];

const roleColors = {
  admin: "danger",
  owner: "warning",
  tenant: "primary",
};

export default function AdminUsersClient() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
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
  const [roleModal, setRoleModal] = useState(null); // { user }
  const [newRole, setNewRole] = useState("");
  const [roleLoading, setRoleLoading] = useState(false);

  const fetchUsers = useCallback(
    async (p = 1, s = "") => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: p, limit: 10 });
        if (s) params.append("search", s);
        const res = await axiosInstance.get(`/users?${params}`);
        setUsers(res.data.data.users || []);
        setPagination(res.data.data.pagination);
      } catch {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers(page, search);
  }, [fetchUsers, page, search]);

  const debouncedSearch = useCallback(
    debounce((val) => {
      setSearch(val);
      setPage(1);
    }, 500),
    []
  );

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const openRoleModal = (user) => {
    setRoleModal(user);
    // If the user already has a role outside the allowed picker
    // options (e.g. an existing "admin"), default the picker
    // selection to their current role anyway so "Update Role" stays
    // disabled until the admin actually picks tenant/owner.
    setNewRole(user.role);
  };

  const handleRoleChange = async () => {
    if (!roleModal || newRole === roleModal.role) {
      setRoleModal(null);
      return;
    }
    setRoleLoading(true);
    try {
      const res = await axiosInstance.patch(`/users/${roleModal._id}/role`, {
        role: newRole,
      });
      setUsers((prev) =>
        prev.map((u) =>
          u._id === roleModal._id ? { ...u, role: newRole } : u
        )
      );
      toast.success(
        `${roleModal.name}'s role changed to ${newRole}`
      );
      setRoleModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    } finally {
      setRoleLoading(false);
    }
  };

  return (
    <div className="page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">All Users</h1>
          <p className="page-description">
            Manage user accounts and assign roles across the platform
          </p>
        </div>
        <Button
          variant="bordered"
          size="sm"
          startContent={<TbRefresh className="w-4 h-4" />}
          onPress={() => fetchUsers(page, search)}
          className="font-medium"
        >
          Refresh
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative mb-6 max-w-md">
        <TbSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchInput}
          onChange={handleSearchInput}
          className="input-base pl-11"
        />
        {searchInput && (
          <button
            onClick={() => {
              setSearchInput("");
              setSearch("");
              setPage(1);
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
                  {["User", "Email", "Role", "Joined", "Google", "Actions"].map(
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
        ) : users.length === 0 ? (
          <EmptyState
            type="users"
            title="No Users Found"
            description={
              search
                ? `No users match "${search}". Try a different search.`
                : "No users registered yet."
            }
          />
        ) : (
          <div className="table-container">
            <table className="w-full">
              <thead className="table-head">
                <tr>
                  {["User", "Email", "Role", "Joined", "Auth Type", "Actions"].map(
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
                {users.map((u, i) => (
                  <motion.tr
                    key={u._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="table-row"
                  >
                    {/* User */}
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={u.photo}
                          name={u.name}
                          size="sm"
                          isBordered
                          color={roleColors[u.role] || "primary"}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                            {u.name}
                            {u._id === currentUser?._id && (
                              <span className="ml-1.5 text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full font-semibold">
                                You
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="table-cell">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {u.email}
                      </span>
                    </td>

                    {/* Role */}
                    <td className="table-cell">
                      <Chip
                        color={roleColors[u.role] || "primary"}
                        variant="flat"
                        size="sm"
                        className="capitalize"
                      >
                        {u.role}
                      </Chip>
                    </td>

                    {/* Joined */}
                    <td className="table-cell">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(u.createdAt)}
                      </span>
                    </td>

                    {/* Auth type */}
                    <td className="table-cell">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          u.isGoogleUser
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {u.isGoogleUser ? "Google" : "Email"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="table-cell">
                      <Tooltip
                        content={
                          u._id === currentUser?._id
                            ? "Cannot change your own role"
                            : "Change role"
                        }
                      >
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          isDisabled={u._id === currentUser?._id}
                          onPress={() => openRoleModal(u)}
                          className="text-blue-500"
                        >
                          <TbEdit className="w-4 h-4" />
                        </Button>
                      </Tooltip>
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
              users
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

      {/* Role Change Modal */}
      <Modal
        isOpen={!!roleModal}
        onClose={() => setRoleModal(null)}
        size="sm"
        classNames={{ backdrop: "backdrop-blur-sm", base: "card-base" }}
      >
        <ModalContent>
          <ModalHeader className="font-heading text-lg border-b border-gray-100 dark:border-gray-800 pb-4">
            Change User Role
          </ModalHeader>
          <ModalBody className="py-6">
            {roleModal && (
              <div className="space-y-5">
                {/* User info */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <Avatar
                    src={roleModal.photo}
                    name={roleModal.name}
                    size="md"
                    isBordered
                    color={roleColors[roleModal.role] || "primary"}
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {roleModal.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {roleModal.email}
                    </p>
                    <div className="mt-1">
                      <Chip
                        color={roleColors[roleModal.role] || "primary"}
                        variant="flat"
                        size="sm"
                        className="capitalize"
                      >
                        Current: {roleModal.role}
                      </Chip>
                    </div>
                  </div>
                </div>

                {/* Role selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select New Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setNewRole(role)}
                        className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium capitalize transition-all ${
                          newRole === role
                            ? role === "owner"
                              ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                              : "border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <Button
              variant="bordered"
              onPress={() => setRoleModal(null)}
              className="font-semibold"
            >
              Cancel
            </Button>
            <Button
              isLoading={roleLoading}
              isDisabled={newRole === roleModal?.role}
              onPress={handleRoleChange}
              className="font-semibold btn-gradient text-white"
            >
              Update Role
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}