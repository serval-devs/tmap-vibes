import { type ChangeEvent, useState, useEffect, useCallback } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const MAX_LENGTH = 300
const MIN_LENGTH = 1

interface ArticleTextBoxProps {
  currentValue?: string
  onValueChange?: (value: string) => void
  onValidationChange?: (isValid: boolean) => void
  onError?: (error: string | null) => void
}

export function ArticleTextBox({ 
  currentValue = "",
  onValueChange, 
  onValidationChange,
  onError,
}: ArticleTextBoxProps) {
  const [value, setValue] = useState(currentValue)

  const validateInput = useCallback((text: string): boolean => {
    const trimmedText = text.trim()
    
    if (trimmedText.length > MAX_LENGTH) {
      onError?.(`Text cannot exceed ${String(MAX_LENGTH)} characters`)
      onValidationChange?.(false)
      return false
    }
    if(trimmedText.length < MIN_LENGTH) {
      onError?.(`Text must be at least ${String(MIN_LENGTH)} characters`)
      onValidationChange?.(false)
      return false
    }

    onError?.(null)
    onValidationChange?.(true)
    return true
  }, [onError, onValidationChange])

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onValueChange?.(newValue)
    validateInput(newValue)
  }, [onValueChange, validateInput])

  // Initial validation and sync with defaultValue
  useEffect(() => {
    if (currentValue !== value) {
      setValue(currentValue)
      validateInput(currentValue)
    }
  }, [currentValue, value, validateInput])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label htmlFor="content">Article Text</Label>
      </div>
      <Textarea
        id="content"
        placeholder="Paste or type article text here..."
        value={value}
        onChange={handleChange}
        className="min-h-[200px] resize-y"
      />
      <div className="flex justify-end items-center text-xs">
        <span className={`
          ${value.length > MAX_LENGTH 
            ? 'text-destructive' 
            : value.length < MIN_LENGTH 
              ? 'text-warning' 
              : 'text-primary'
        }`}>
          {value.length}/{MAX_LENGTH}
        </span>
      </div>
    </div>
  )
}

ArticleTextBox.displayName = "ArticleTextBox"