import { type ChangeEvent, useState, useEffect, useCallback } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const MAX_WORDS = 300 // Limit for validation/submission
const MIN_WORDS = 1
const MAX_CHARS = 3000 // Character limit for the textarea
const PASTE_WORDS_LIMIT = 500 // Hard limit for pasting too much text

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
    const charCount = text.length

    if (!trimmedText) {
      onError?.("Text is required")
      onValidationChange?.(false)
      return false
    }
    
    if (charCount > MAX_CHARS) {
      onError?.(`Text cannot exceed ${String(MAX_CHARS)} characters`)
      onValidationChange?.(false)
      return false
    }
    
    if (wordCount > MAX_WORDS) {
      onError?.(`Text cannot exceed ${String(MAX_WORDS)} words for analysis`)
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
    let newValue = e.target.value

    // First limit by characters
    if (newValue.length > MAX_CHARS) {
      newValue = newValue.slice(0, MAX_CHARS)
    }
    
    // Then check word count for pasting large amounts
    const wordCount = countWords(newValue)
    if (wordCount > PASTE_WORDS_LIMIT) {
      // If pasting too much, truncate to the PASTE_WORDS_LIMIT
      const words = newValue.trim().split(/\s+/).filter(word => word.length > 0)
      newValue = words.slice(0, PASTE_WORDS_LIMIT).join(' ')
    }
    
    setValue(newValue)
    onValueChange?.(newValue)
    validateInput(newValue)
  }, [onValueChange, validateInput, countWords])

  // Initial validation and sync with defaultValue
  useEffect(() => {
    if (currentValue !== value) {
      // Apply the same limits to incoming values
      let newValue = currentValue
      
      if (newValue.length > MAX_CHARS) {
        newValue = newValue.slice(0, MAX_CHARS)
      }
      
      const wordCount = countWords(newValue)
      if (wordCount > PASTE_WORDS_LIMIT) {
        const words = newValue.trim().split(/\s+/).filter(word => word.length > 0)
        newValue = words.slice(0, PASTE_WORDS_LIMIT).join(' ')
      }
      //eslint-disable-next-line
      setValue(newValue) 
      validateInput(newValue)
    }
  }, [currentValue, value, validateInput, countWords])

  const wordCount = countWords(value)
  const charCount = value.length

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label htmlFor="content">
          Article Text 
          <span className="ml-2 text-xs text-muted-foreground">
          </span>
        </Label>
      </div>
      <Textarea
        id="content"
        placeholder="Paste or type article text here..."
        value={value}
        onChange={handleChange}
        className="min-h-[200px] resize-y"
        maxLength={MAX_CHARS}
      />
      <div className="flex justify-between items-center text-xs">
        <span className={charCount > MAX_CHARS ? 'text-destructive' : 'text-muted-foreground'}>
        </span>
        <span className={`
          ${wordCount > MAX_WORDS 
            ? 'text-destructive' 
            : wordCount < MIN_WORDS 
              ? 'text-warning' 
              : 'text-primary'
          }`}>
          {wordCount}/{MAX_WORDS} words
        </span>
      </div>
    </div>
  )
}

ArticleTextBox.displayName = "ArticleTextBox"