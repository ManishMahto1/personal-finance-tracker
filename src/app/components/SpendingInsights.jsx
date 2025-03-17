import React from "react";
import { AlertTriangle } from "lucide-react";

const SpendingInsights = ({ spendingInsights }) => (
  spendingInsights.length > 0 && (
    <div className="bg-yellow-50 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="text-yellow-600" /> Spending Alerts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {spendingInsights.map((insight, index) => (
          <div key={index} className="p-4 bg-white rounded-lg border border-yellow-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{insight.category}</h3>
                <p className="text-sm text-gray-500">{insight.month}</p>
              </div>
              <span className="text-red-600 font-semibold">Overspent: ₹{insight.overspend.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
);

export default SpendingInsights;