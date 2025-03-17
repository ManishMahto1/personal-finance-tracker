"use client";
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Wallet, 
  PieChart, 
  Settings, 
  ChevronLeft, 
  Menu, 
  Plus,
  ArrowLeftRight,
  TrendingUp
} from 'lucide-react';
import React, {useState,useEffect, useMemo } from "react";
import moment from "moment";
import { fetchTransactions, fetchBudgets, saveBudget, deleteBudget, saveTransaction, updateTransaction, deleteTransaction } from "@/app/lib/api";
import SummaryCards from "@/app/lib/components/SummaryCards";
import BudgetForm from "@/app/lib/components/BudgetForm";
import BudgetList from "@/app/lib/components/BudgetList";
import SpendingInsights from "@/app/lib/components/SpendingInsights";
import TransactionForm from "@/app/lib/components/TransactionForm";
import TransactionList from "@/app/lib/components/TransactionList";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');

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
  
  const sidebarVariants = {
    open: { width: 240 },
    closed: { width: 72 }
  };

  const contentVariants = {
    open: { marginLeft: 240 },
    closed: { marginLeft: 72 }
  };

  const navigationItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={24} />, label: 'Dashboard' },
    { id: 'transactions', icon: <ArrowLeftRight size={24} />, label: 'Transactions' },
    { id: 'budgets', icon: <PieChart size={24} />, label: 'Budgets' },
    { id: 'insights', icon: <TrendingUp size={24} />, label: 'insights' },
    
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.nav
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed h-full bg-white shadow-xl z-20"
      >
        <div className="flex flex-col h-full p-4">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-8">
            {isSidebarOpen ? (
              <>
                <h1 className="text-xl font-bold text-indigo-600">Personal finance tracker</h1>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft size={20} />
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={20} />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <div className="space-y-2 flex-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeView === item.id 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {item.icon}
                {isSidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            ))}
          </div>

          {/* Sidebar Footer */}
          {isSidebarOpen && (
            <div className="mt-auto border-t pt-4">
              <button className="w-full flex items-center gap-2 p-3 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings size={20} />
                <span className="text-sm">Account Settings</span>
              </button>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Main Content */}
      <motion.main
        variants={contentVariants}
        animate={isSidebarOpen ? "open" : "closed"}
        className="flex-1 p-8 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 capitalize">
                {activeView.replace('-', ' ')}
              </h2>
              <p className="text-gray-500">Your personal finance dashboard</p>
            </div>
            
          </div>

          {/* Dynamic Content */}
          <div className="space-y-8">
            {activeView === 'dashboard' && (
              <div className=" gap-6">
                {/* Summary Cards */}
              <SummaryCards totalExpenses={totalExpenses} pieChartData={pieChartData} recentTransactions={recentTransactions} />
             
              </div>
            )}

            {activeView === 'transactions' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-gray-800 font-medium mb-6">Recent Transactions</h3>
                {/* Transaction list implementation */}
                <TransactionForm formData={formData} setFormData={setFormData} categories={categories} isSubmitting={isSubmitting} setIsSubmitting={setIsSubmitting} editId={editId} setEditId={setEditId} saveTransaction={saveTransaction} updateTransaction={updateTransaction} fetchTransactions={() => fetchTransactions(setTransactions, setIsLoading)} showToast={showToast} showError={showError} initialFormState={initialFormState} />
                <TransactionList transactions={transactions} chartData={chartData} pieChartData={pieChartData} deleteTransaction={deleteTransaction} setFormData={setFormData} setEditId={setEditId} fetchTransactions={() => fetchTransactions(setTransactions, setIsLoading)} showToast={showToast} showError={showError} />
              
              </div>
            )}

            {activeView === 'budgets' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-gray-800 font-medium mb-6">Budget Management</h3>
                {/* Budget management implementation */}
                <BudgetForm budgetForm={budgetForm} setBudgetForm={setBudgetForm} categories={categories} saveBudget={saveBudget} fetchBudgets={() => fetchBudgets(setBudgets)} showToast={showToast} showError={showError} />
               
                <BudgetList budgets={budgets} budgetComparisonData={budgetComparisonData} deleteBudget={deleteBudget} fetchBudgets={() => fetchBudgets(setBudgets)} showToast={showToast} showError={showError} />
              </div>
            )}
             {activeView === 'insights' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-gray-800 font-medium mb-6">Budget Management</h3>
                {/* Budget management implementation */}
               
                <SpendingInsights spendingInsights={spendingInsights} />
               
              </div>
            )}
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default DashboardLayout;