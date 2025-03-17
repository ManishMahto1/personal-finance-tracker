"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const SummaryCards = ({ totalExpenses = 0, pieChartData = [], recentTransactions = [] }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-2">Total Expenses</h2>
      <p className="text-2xl font-bold text-blue-600">₹{totalExpenses.toLocaleString("en-IN")}</p>
    </div>
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-2">Category Breakdown</h2>
      <div className="h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value">
              {pieChartData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
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
          <div key={transaction._id} className="flex justify-between items-center text-sm">
            <span className="truncate">{transaction.description || "No description"}</span>
            <span>₹{Number(transaction.amount || 0).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SummaryCards;