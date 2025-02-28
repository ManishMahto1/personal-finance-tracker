import React from "react";
import { Loader2 } from "lucide-react";

const TransactionForm = ({ formData, setFormData, categories, isSubmitting, setIsSubmitting, editId, setEditId, saveTransaction, updateTransaction, fetchTransactions, showToast, showError, initialFormState }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData, amount: parseFloat(formData.amount) };
      if (editId) {
        await updateTransaction(editId, payload);
        showToast("Transaction updated successfully");
      } else {
        await saveTransaction(payload);
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{editId ? "Edit Transaction" : "Add New Transaction"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Amount</label>
            <input type="number" step="0.01" required className="w-full p-2 border rounded" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Date</label>
            <input type="date" required className="w-full p-2 border rounded" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Description</label>
            <input required className="w-full p-2 border rounded" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Category</label>
            <select className="w-full p-2 border rounded" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />}
          {editId ? "Update Transaction" : "Add Transaction"}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;