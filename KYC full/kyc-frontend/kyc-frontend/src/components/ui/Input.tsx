import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, className = "", ...props }, ref) => (
  <label className="flex flex-col gap-1 text-sm">
    {label && <span className="text-gray-600">{label}</span>}
    <input
      ref={ref}
      className={`border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 ${className}`}
      {...props}
    />
  </label>
));
Input.displayName = "Input";
export default Input;
