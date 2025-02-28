import React from "react";
import moment from "moment";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Edit, Trash2 } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const TransactionList = ({ transactions, chartData, pieChartData, deleteTransaction, setFormData, setEditId, fetchTransactions, showToast, showError }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-4">All Transactions</h2>
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction._id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <p className="font-medium">{transaction.description}</p>
            <div className="text-sm text-gray-500">
              <span>{moment(transaction.date).format("MMM Do, YYYY")}</span>
              <span className="mx-2">•</span>
              <span>{transaction.category}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">₹{Number(transaction.amount).toFixed(2)}</span>
            <button className="p-1 hover:bg-gray-100 rounded" onClick={() => { setFormData(transaction); setEditId(transaction._id); }}>
              <Edit className="h-4 w-4" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded text-red-600" onClick={async () => {
              try {
                await deleteTransaction(transaction._id);
                showToast("Transaction deleted successfully");
                await fetchTransactions();
              } catch (error) {
                showError("Deletion failed", error);
              }
            }}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
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
      <div className="bg-white rounded-lg p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Expenses by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieChartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Legend />
            <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default TransactionList;