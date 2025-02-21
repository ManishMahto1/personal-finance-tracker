"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import axios from "axios";

const MonthlyExpensesChart = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [newTransaction, setNewTransaction] = useState({ amount: "", date: "", description: "" });
  const [editTransaction, setEditTransaction] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/transactions");
      

      if (!Array.isArray(response.data.data)) {
        throw new Error("Invalid data format");
      }

      setTransactions(response.data.data);
      setFetchError(null);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setFetchError(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setNewTransaction({ ...newTransaction, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    let errors = {};
    if (!newTransaction.amount) errors.amount = "Amount is required";
    if (!newTransaction.date) errors.date = "Date is required";
    if (!newTransaction.description) errors.description = "Description is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddTransaction = async () => {
    if (!validateForm()) return;
    try {
      await axios.post("/api/transactions", newTransaction);
      fetchTransactions();
      setNewTransaction({ amount: "", date: "", description: "" });
    } catch (error) {
      setFetchError(error.response?.data?.message || "Failed to add transaction");
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      fetchTransactions();
    } catch (error) {
      setFetchError(error.response?.data?.message || "Failed to delete transaction");
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditTransaction(transaction.id);
    setNewTransaction(transaction);
  };

  const handleUpdateTransaction = async () => {
    if (!validateForm()) return;
    try {
      await axios.put(`/api/transactions/${editTransaction}`, newTransaction);
      fetchTransactions();
      setEditTransaction(null);
      setNewTransaction({ amount: "", date: "", description: "" });
    } catch (error) {
      setFetchError(error.response?.data?.message || "Failed to update transaction");
    }
  };

  // Prepare data for the chart (group by month)
    const monthlyExpenses = {};
    transactions.forEach(transaction => {
      const month = moment(transaction.date).format('MMM YYYY') // Format

        if (!monthlyExpenses[month]) {
            monthlyExpenses[month] = 0;
        }
        monthlyExpenses[month] += parseFloat(transaction.amount); // Parse as float!
    });

    const chartData = Object.entries(monthlyExpenses).map(([month, amount]) => ({
        name: month,
        amount: amount,
    }));
  
 
  //if (isLoading) return <p>Loading...</p>;
  // if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8"> Personal Finance Tracker</h1>
        {fetchError && <p className="text-red-500">Error: {fetchError}</p>}
        {/* Form for adding or editing transactions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {editTransaction ? "Edit Transaction" : "Add New Transaction"}
          </h2>
          <input type="number" name="amount" placeholder="₹0.00" value={newTransaction.amount} onChange={handleInputChange} className="border p-2 rounded w-full mb-2" />
          <input type="date" name="date" value={newTransaction.date} onChange={handleInputChange} className="border p-2 rounded w-full mb-2" />
          <input type="text" name="description" placeholder="Enter description" value={newTransaction.description} onChange={handleInputChange} className="border p-2 rounded w-full mb-2" />
          <button onClick={editTransaction ? handleUpdateTransaction : handleAddTransaction} className="bg-indigo-600 text-white p-2 rounded w-full">
            {editTransaction ? "Update" : "Add"}
          </button>
        </div>
        {/* Transactions List */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Transactions</h2>
          {transactions.map((transaction) => (
            <div key={transaction._id} className="flex justify-between p-2 border-b">
              <span>{transaction.description
              } - ₹{transaction.amount
                }</span>
              <div>
                <button onClick={() => handleEditTransaction(transaction)} className="text-blue-500 mr-2">Edit</button>
                <button onClick={() => handleDeleteTransaction(transaction._id)} className="text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
        {/* Chart Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Monthly Expenses Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />  {/* ✅ Ensure tooltip formatting */}
              <Legend />
              <Bar dataKey="amount" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MonthlyExpensesChart;
