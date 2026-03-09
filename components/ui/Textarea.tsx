import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-muted">
            {label}
            {props.required && <span className="ml-1 text-accent">*</span>}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          rows={4}
          className={cn(
            "w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm text-white placeholder:text-muted/50 resize-y",
            "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className,
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-muted">{hint}</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
export default Textarea;
