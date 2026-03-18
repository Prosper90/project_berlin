'use client';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label?: string;
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
}

export default function MultiSelect({ label, options, values, onChange }: MultiSelectProps) {
  const toggle = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <p className="text-sm font-medium text-muted">{label}</p>
      )}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors select-none ${
              values.includes(opt.value)
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-input text-muted hover:border-accent/40 hover:text-white'
            }`}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={values.includes(opt.value)}
              onChange={() => toggle(opt.value)}
            />
            <span
              className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border ${
                values.includes(opt.value) ? 'border-accent bg-accent' : 'border-muted/50'
              }`}
            >
              {values.includes(opt.value) && (
                <svg className="h-2.5 w-2.5 text-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}
