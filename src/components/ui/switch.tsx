// src/components/ui/switch.tsx
import React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  containerClassName?: string;
  switchClassName?: string;
  labelClassName?: string;
}

export function Switch({
  id: name,
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
  containerClassName,
  switchClassName,
  labelClassName,
}: SwitchProps) {
  const id = React.useId();

  const switchSizes = {
    sm: "h-5 w-9",
    md: "h-6 w-11",
    lg: "h-7 w-14",
  };

  const thumbSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const thumbPositions = {
    sm: checked ? "translate-x-4" : "translate-x-1",
    md: checked ? "translate-x-5" : "translate-x-1",
    lg: checked ? "translate-x-7" : "translate-x-1",
  };

  return (
    <div className={cn("flex items-start", containerClassName)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={cn(
          switchSizes[size],
          "relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent",
          "transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          checked ? "bg-primary-600" : "bg-gray-200",
          disabled && "opacity-50 cursor-not-allowed",
          switchClassName
        )}
        onClick={() => !disabled && onChange(!checked)}
        id={name}
      >
        <span
          className={cn(
            "pointer-events-none inline-block transform rounded-full bg-white ring-0",
            "transition duration-200 ease-in-out",
            thumbSizes[size],
            thumbPositions[size]
          )}
        />
      </button>
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label
              htmlFor={id}
              className={cn(
                "text-sm font-medium text-gray-700",
                disabled && "opacity-50",
                labelClassName
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              className={cn("text-sm text-gray-500", disabled && "opacity-50")}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
