import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-muted">
            {label}
            {props.required && <span className="ml-1 text-accent">*</span>}
          </label>
        )}
        <select
          id={inputId}
          ref={ref}
          className={cn(
            "w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm text-white",
            "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-500",
            className,
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
export default Select;
