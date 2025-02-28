import axios from "axios";

export const fetchTransactions = async (setTransactions, setIsLoading) => {
  try {
    const { data } = await axios.get("/api/transactions");
    if (Array.isArray(data.data)) setTransactions(data.data);
  } finally {
    setIsLoading(false);
  }
};

export const fetchBudgets = async (setBudgets) => {
  const { data } = await axios.get("/api/budgets");
  if (Array.isArray(data.data)) setBudgets(data.data);
};

export const saveBudget = (payload) => axios.post("/api/budgets", payload);
export const deleteBudget = (id) => axios.delete(`/api/budgets?id=${id}`);
export const saveTransaction = (payload) => axios.post("/api/transactions", payload);
export const updateTransaction = (id, payload) => axios.put(`/api/transactions/${id}`, payload);
export const deleteTransaction = (id) => axios.delete(`/api/transactions/${id}`);
