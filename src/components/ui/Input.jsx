// src/components/ui/input.jsx (or input.tsx)
import * as React from "react";

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" // Example styling
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input"; // Important for React.forwardRef

export { Input }; // Correct export!  This is the crucial part that was missing.