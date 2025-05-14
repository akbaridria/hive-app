"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type React from "react"
import { useId, useState } from "react"

interface CurrencyInputProps {
  label: string
  placeholder?: string
  disabled?: boolean
  currency?: string
  defaultValue?: string | number
  onChange?: (value: number | null) => void
  className?: string
  required?: boolean
  name?: string
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  placeholder = "0.00",
  disabled = false,
  currency = "$",
  defaultValue = "",
  onChange,
  className,
  required = false,
  name,
}) => {
  const id = useId()
  const [value, setValue] = useState(() => {
    if (typeof defaultValue === "number") {
      return defaultValue.toString()
    }
    return defaultValue
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // Only allow digits and at most one decimal point
    if (/^$|^[0-9]+(\.[0-9]*)?$/.test(inputValue)) {
      setValue(inputValue)

      // Convert to number and call onChange
      if (onChange) {
        const numericValue = inputValue === "" ? null : Number.parseFloat(inputValue)
        onChange(numericValue)
      }
    }
  }

  // Format for display when input loses focus
  const handleBlur = () => {
    if (value === "") return

    const numericValue = Number.parseFloat(value)
    onChange?.(numericValue)
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-destructive ms-1">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          id={id}
          name={name}
          className={cn("pe-3", className)}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          type="text"
          inputMode="decimal"
          disabled={disabled}
          required={required}
          aria-required={required}
        />
        <span className="pointer-events-none text-xs absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
          {currency}
        </span>
      </div>
    </div>
  )
}

export default CurrencyInput
