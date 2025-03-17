import React from "react";
import moment from "moment";
import { Trash2 } from "lucide-react";
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
const BudgetList = ({ budgets, budgetComparisonData, deleteBudget, fetchBudgets, showToast, showError }) =>   (

<div className="bg-white rounded-lg shadow p-6">
  
  <h2 className="text-xl font-semibold mb-4">Budget vs Actual Spending</h2>
  <div className="h-[400px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={budgetComparisonData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name"  textAnchor="end" height={70} /> {/* Use 'name' for unique month-category */}
        <YAxis tickFormatter={(value) => `₹${value}`} />
        <Tooltip
          formatter={(value) => `₹${value.toFixed(2)}`}
          labelFormatter={(label) => `${label}`}
        />
        <Legend />
        <Bar dataKey="budget" fill="#8884d8" name="Budget" />
        <Bar dataKey="actual" fill="#82ca9d" name="Actual Spending" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
  /* <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-4">Current Budgets</h2>
    <div className="space-y-4">
      {budgets.map((budget) => {
        const monthKey = `${budget.year}-${String(budget.month).padStart(2, "0")}`;
        const actual = budgetComparisonData.find((d) => d.category === budget.category && d.month === moment(monthKey, "YYYY-MM").format("MMM YYYY"))?.actual || 0;
        return (
          <div key={budget._id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <p className="font-medium">{budget.category}</p>
              <div className="text-sm text-gray-500">{moment(monthKey, "YYYY-MM").format("MMM YYYY")}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">₹{budget.budget.toFixed(2)}</p>
                <p className={`text-sm ${actual > budget.budget ? "text-red-600" : "text-green-600"}`}>Actual: ₹{actual.toFixed(2)}</p>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded text-red-600" onClick={async () => {
                try {
                  await deleteBudget(budget._id);
                  showToast("Budget deleted successfully");
                  await fetchBudgets();
                } catch (error) {
                  showError("Failed to delete budget", error);
                }
              }}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div> */
);

export default BudgetList;