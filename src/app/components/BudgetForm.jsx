"use client";

import React,{useState} from "react";
import { Loader2 } from "lucide-react";

const BudgetForm = ({ budgetForm, setBudgetForm, categories, saveBudget, fetchBudgets, showToast, showError }) => {
  const [isBudgetLoading, setIsBudgetLoading] = useState(false); // Local state for loading

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    setIsBudgetLoading(true);
    try {
      const payload = {
        ...budgetForm,
        budget: parseFloat(budgetForm.budget),
      };
      await saveBudget(payload);
      showToast("Budget saved successfully");
      setBudgetForm({ category: "General", budget: "", month: budgetForm.month });
      await fetchBudgets();
    } catch (error) {
      showError("Failed to save budget", error);
    } finally {
      setIsBudgetLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Set Monthly Budget</h2>
      <form onSubmit={handleBudgetSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Category</label>
            <select
              className="w-full p-2 border rounded"
              value={budgetForm.category}
              onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Budget Amount</label>
            <input
              type="number"
              step="0.01"
              required
              className="w-full p-2 border rounded"
              value={budgetForm.budget}
              onChange={(e) => setBudgetForm({ ...budgetForm, budget: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Month</label>
            <input
              type="month"
              required
              className="w-full p-2 border rounded"
              value={budgetForm.month}
              onChange={(e) => setBudgetForm({ ...budgetForm, month: e.target.value })}
            />
          </div>
          <div className="space-y-2 flex items-end">
            <button
              type="submit"
              disabled={isBudgetLoading}
              className="w-full bg-green-600 text-white p-2 rounded disabled:opacity-50"
            >
              {isBudgetLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                "Save Budget"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;