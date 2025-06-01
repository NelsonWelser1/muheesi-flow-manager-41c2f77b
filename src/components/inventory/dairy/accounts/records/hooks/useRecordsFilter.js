
import { useState, useMemo } from 'react';

export const useRecordsFilter = (billsExpenses) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [dateFilter, setDateFilter] = useState("all");

  const getTimeRangeDate = () => {
    const now = new Date();
    switch (timeRange) {
      case "hour":
        return new Date(now.setHours(now.getHours() - 1));
      case "day":
        return new Date(now.setDate(now.getDate() - 1));
      case "week":
        return new Date(now.setDate(now.getDate() - 7));
      case "month":
        return new Date(now.setMonth(now.getMonth() - 1));
      case "year":
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return null;
    }
  };

  const getDateFilterRange = () => {
    const now = new Date();
    switch (dateFilter) {
      case "daily":
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        return { start: startOfDay, end: endOfDay };
      case "monthly":
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        return { start: startOfMonth, end: endOfMonth };
      case "annually":
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        return { start: startOfYear, end: endOfYear };
      default:
        return null;
    }
  };

  const filteredRecords = useMemo(() => {
    return billsExpenses
      .filter(record => {
        // Status filter
        if (statusFilter !== "all" && record.status !== statusFilter) {
          return false;
        }

        // Time range filter
        if (timeRange !== "all") {
          const timeRangeDate = getTimeRangeDate();
          const recordDate = new Date(record.created_at);
          if (recordDate < timeRangeDate) {
            return false;
          }
        }

        // Date filter (daily, monthly, annually)
        if (dateFilter !== "all") {
          const dateRange = getDateFilterRange();
          const recordDate = new Date(record.created_at);
          if (recordDate < dateRange.start || recordDate > dateRange.end) {
            return false;
          }
        }

        // Search term
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            record.bill_number?.toLowerCase().includes(searchLower) ||
            record.supplier_name?.toLowerCase().includes(searchLower) ||
            record.expense_type?.toLowerCase().includes(searchLower) ||
            record.expense_details?.toLowerCase().includes(searchLower) ||
            record.notes?.toLowerCase().includes(searchLower)
          );
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "date-asc":
            return new Date(a.created_at) - new Date(b.created_at);
          case "date-desc":
            return new Date(b.created_at) - new Date(a.created_at);
          case "amount-asc":
            return a.amount - b.amount;
          case "amount-desc":
            return b.amount - a.amount;
          case "name-asc":
            return a.supplier_name.localeCompare(b.supplier_name);
          case "name-desc":
            return b.supplier_name.localeCompare(a.supplier_name);
          default:
            return new Date(b.created_at) - new Date(a.created_at);
        }
      });
  }, [billsExpenses, statusFilter, timeRange, searchTerm, sortBy, dateFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    timeRange,
    setTimeRange,
    sortBy,
    setSortBy,
    dateFilter,
    setDateFilter,
    filteredRecords
  };
};
