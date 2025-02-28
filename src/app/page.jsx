"use client";
import React, {useState,useEffect, useMemo } from "react";
import moment from "moment";
import { fetchTransactions, fetchBudgets, saveBudget, deleteBudget, saveTransaction, updateTransaction, deleteTransaction } from "@/app/lib/api";
import SummaryCards from "@/app/components/SummaryCards";
import BudgetForm from "@/app/components/BudgetForm";
import BudgetList from "@/app/components/BudgetList";
import SpendingInsights from "@/app/components/SpendingInsights";
import TransactionForm from "@/app/components/TransactionForm";
import TransactionList from "@/app/components/TransactionList";

const MonthlyExpensesChart = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [budgetForm, setBudgetForm] = useState({
    category: "General",
    budget: "",
    month: moment().format("YYYY-MM"),
  });
  const initialFormState = {
    amount: "",
    date: moment().format("YYYY-MM-DD"),
    description: "",
    category: "General",
  };
  const [formData, setFormData] = useState(initialFormState);

  const categories = useMemo(() => ["General", "Food", "Transportation", "Entertainment", "Bills", "Shopping"], []);

  const { chartData, pieChartData, totalExpenses, recentTransactions, budgetComparisonData, spendingInsights } = useMemo(() => {
    const monthlyExpenses = {};
    const categoryExpenses = {};
    const monthlyCategoryExpenses = {};
    let total = 0;
  
    // Process transactions correctly by deriving month from transaction date
    transactions.forEach((transaction) => {
      const month = moment(transaction.date).format("MMM YYYY");
      const monthKey = moment(transaction.date).format("YYYY-MM"); // Use transaction date for monthKey
  
      monthlyExpenses[month] = (monthlyExpenses[month] || 0) + Number(transaction.amount);
      categoryExpenses[transaction.category] = (categoryExpenses[transaction.category] || 0) + Number(transaction.amount);
  
      if (!monthlyCategoryExpenses[monthKey]) {
        monthlyCategoryExpenses[monthKey] = {};
      }
      monthlyCategoryExpenses[monthKey][transaction.category] =
        (monthlyCategoryExpenses[monthKey][transaction.category] || 0) + Number(transaction.amount);
      total += Number(transaction.amount);
    });
  
    // Process budget comparisons
    const comparisonData = [];
    const insights = [];
  
    budgets.forEach((budget) => {
      const monthKey = `${budget.year}-${String(budget.month).padStart(2, "0")}`;
      const actual = monthlyCategoryExpenses[monthKey]?.[budget.category] || 0;
      const difference = budget.budget - actual;
  
      comparisonData.push({
        name: `${moment(monthKey, "YYYY-MM").format("MMM YYYY")} - ${budget.category}`, // Unique key for chart
        month: moment(monthKey, "YYYY-MM").format("MMM YYYY"),
        category: budget.category,
        budget: budget.budget,
        actual,
        difference,
      });
  
      if (actual > budget.budget) {
        insights.push({
          category: budget.category,
          month: moment(monthKey, "YYYY-MM").format("MMM YYYY"),
          overspend: actual - budget.budget,
        });
      }
    });
    
    return {
      chartData: Object.entries(monthlyExpenses).map(([name, amount]) => ({ name, amount })),
      pieChartData: Object.entries(categoryExpenses).map(([name, value]) => ({ name, value })),
      totalExpenses: total,
      recentTransactions: transactions.slice(0, 5),
      budgetComparisonData: comparisonData,
      spendingInsights: insights,
    };
  }, [transactions, budgets]);

  useEffect(() => {
    fetchTransactions(setTransactions, setIsLoading);
    fetchBudgets(setBudgets);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const showError = (message, error) => {
    console.error(error);
    setToast({ show: true, message: `${message}: ${error.response?.data?.message || error.message}`, type: "error" });
    setTimeout(() => setToast({ ...toast, show: false }), 5000);
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

  //console.log(budgetComparisonData);
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {toast.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-md ${toast.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {toast.message}
        </div>
      )}
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Personal Finance Tracker</h1>
        <SummaryCards totalExpenses={totalExpenses} pieChartData={pieChartData} recentTransactions={recentTransactions} />
        <BudgetForm budgetForm={budgetForm} setBudgetForm={setBudgetForm} categories={categories} saveBudget={saveBudget} fetchBudgets={() => fetchBudgets(setBudgets)} showToast={showToast} showError={showError} />
     
        <SpendingInsights spendingInsights={spendingInsights} />
        <BudgetList budgets={budgets} budgetComparisonData={budgetComparisonData} deleteBudget={deleteBudget} fetchBudgets={() => fetchBudgets(setBudgets)} showToast={showToast} showError={showError} />
        <TransactionForm formData={formData} setFormData={setFormData} categories={categories} isSubmitting={isSubmitting} setIsSubmitting={setIsSubmitting} editId={editId} setEditId={setEditId} saveTransaction={saveTransaction} updateTransaction={updateTransaction} fetchTransactions={() => fetchTransactions(setTransactions, setIsLoading)} showToast={showToast} showError={showError} initialFormState={initialFormState} />
        <TransactionList transactions={transactions} chartData={chartData} pieChartData={pieChartData} deleteTransaction={deleteTransaction} setFormData={setFormData} setEditId={setEditId} fetchTransactions={() => fetchTransactions(setTransactions, setIsLoading)} showToast={showToast} showError={showError} />
      </div>
    </div>
  );
};

export default MonthlyExpensesChart;