import { type ChangeEvent, useState, useEffect, useCallback } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const MAX_WORDS = 300
const MIN_WORDS = 1

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

  const countWords = useCallback((text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }, [])

  const validateInput = useCallback((text: string): boolean => {
    const wordCount = countWords(text)
    const trimmedText = text.trim()

    if (!trimmedText) {
      onError?.("Text is required")
      onValidationChange?.(false)
      return false
    }
    
    if (wordCount > MAX_WORDS) {
      onError?.(`Text cannot exceed ${String(MAX_WORDS)} words`)
      onValidationChange?.(false)
      return false
    }

    if (wordCount < MIN_WORDS) {
      onError?.(`Text must be at least ${String(MIN_WORDS)} word`)
      onValidationChange?.(false)
      return false
    }

    onError?.(null)
    onValidationChange?.(true)
    return true
  }, [onError, onValidationChange, countWords])

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
          ${countWords(value) > MAX_WORDS 
            ? 'text-destructive' 
            : countWords(value) < MIN_WORDS 
              ? 'text-warning' 
              : 'text-primary'
        }`}>
          {countWords(value)}/{MAX_WORDS}
        </span>
      </div>
    </div>
  )
}

ArticleTextBox.displayName = "ArticleTextBox"