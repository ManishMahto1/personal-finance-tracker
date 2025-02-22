"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import moment from "moment";
import axios from "axios";
import { Loader2, Edit, Trash2 } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const MonthlyExpensesChart = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const initialFormState = {
    amount: "",
    date: moment().format("YYYY-MM-DD"),
    description: "",
    category: "General",
  };

  const [formData, setFormData] = useState(initialFormState);

  const categories = useMemo(() =>
    ["General", "Food", "Transportation", "Entertainment", "Bills", "Shopping"], []);

  // Data processing moved to useMemo for optimization
  const { chartData, pieChartData, totalExpenses, recentTransactions } = useMemo(() => {
    const monthlyExpenses = {};
    const categoryExpenses = {};
    let total = 0;

    transactions.forEach((transaction) => {
      const month = moment(transaction.date).format("MMM YYYY");
      monthlyExpenses[month] = (monthlyExpenses[month] || 0) + Number(transaction.amount);

      categoryExpenses[transaction.category] =
        (categoryExpenses[transaction.category] || 0) + Number(transaction.amount);

      total += Number(transaction.amount);
    });

    return {
      chartData: Object.entries(monthlyExpenses).map(([name, amount]) => ({ name, amount })),
      pieChartData: Object.entries(categoryExpenses).map(([name, value]) => ({ name, value })),
      totalExpenses: total,
      recentTransactions: transactions.slice(0, 5)
    };
  }, [transactions]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get("/api/transactions");
      if (Array.isArray(data.data)) {
        setTransactions(data.data);
      }
    } catch (error) {
      showError("Failed to fetch transactions", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (editId) {
        await axios.put(`/api/transactions/${editId}`, payload);
        showToast("Transaction updated successfully");
      } else {
        await axios.post("/api/transactions", payload);
        showToast("Transaction added successfully");
      }

      setFormData(initialFormState);
      setEditId(null);
      await fetchTransactions();
    } catch (error) {
      showError(editId ? "Update failed" : "Creation failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      showToast("Transaction deleted successfully");
      await fetchTransactions();
    } catch (error) {
      showError("Deletion failed", error);
    }
  };

  const showError = (message, error) => {
    console.error(error);
    setToast({
      show: true,
      message: `${message}: ${error.response?.data?.message || error.message}`,
      type: "error"
    });
    setTimeout(() => setToast({ ...toast, show: false }), 5000);
  };

  const showToast = (message) => {
    setToast({ show: true, message, type: "success" });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[200px] w-full rounded-lg bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

 //console.log(chartData, pieChartData, totalExpenses, recentTransactions);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {toast.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-md ${toast.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Personal Finance Tracker</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Total Expenses</h2>
            <p className="text-2xl font-bold text-blue-600">
              ₹{totalExpenses.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Category Breakdown</h2>
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    dataKey="value"
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
            <div className="space-y-2">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="truncate">{transaction.description}</span>
                  <span>₹{Number(transaction.amount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editId ? "Edit Transaction" : "Add New Transaction"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Date</label>
                <input
                  type="date"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Description</label>
                <input
                  required
                  className="w-full p-2 border rounded"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Category</label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />}
              {editId ? "Update Transaction" : "Add Transaction"}
            </button>
          </form>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">All Transactions </h2>
          <div className="space-y-4">
          <div className="space-y-2">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{transaction.description}</p>
                    <div className="text-sm text-gray-500">
                      <span>{moment(transaction.date).format("MMM Do, YYYY")}</span>
                      <span className="mx-2">•</span>
                      <span>{transaction.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      ₹{Number(transaction.amount).toFixed(2)}
                    </span>
                    <button
                      className="p-1 hover:bg-gray-100 rounded"
                      onClick={() => {
                        setFormData(transaction);
                        setEditId(transaction._id);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-100 rounded text-red-600"
                      onClick={() => handleDelete(transaction._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-[400px]">
            <h2 className="text-xl font-semibold mb-4">Monthly Expenses</h2>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `₹${value}`} />
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} />
                  <Legend />
                  <Bar dataKey="amount" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>


            <div className="bg-white rounded-lg  p-6 mt-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Expenses by Category</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>


         
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyExpensesChart;