import { type ChangeEvent, useState, useEffect, useCallback } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const MAX_LENGTH = 300
const MIN_LENGTH = 1

interface ArticleTextBoxProps {
  defaultValue?: string
  onValueChange?: (value: string) => void
  onValidationChange?: (isValid: boolean) => void
  onError?: (error: string | null) => void
}

export function ArticleTextBox({ 
  defaultValue = "",
  onValueChange, 
  onValidationChange,
  onError,
}: ArticleTextBoxProps) {
  const [value, setValue] = useState(defaultValue)

  const validateInput = useCallback((text: string): boolean => {
    const trimmedText = text.trim()
    
    if (trimmedText.length > MAX_LENGTH) {
      onError?.(`Text cannot exceed ${String(MAX_LENGTH)} characters`)
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
    if (defaultValue !== value) {
      setValue(defaultValue)
      validateInput(defaultValue)
    }
  }, [defaultValue, value, validateInput])

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