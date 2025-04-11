import { type ChangeEvent, useState, useEffect, useCallback } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const MAX_LENGTH = 5000
const MIN_LENGTH = 10

interface ArticleTextBoxProps {
  onValueChange?: (value: string) => void
  onValidationChange?: (isValid: boolean) => void
  fileName?: string
  ref?: React.Ref<HTMLTextAreaElement>
  onError?: (error: string | null) => void
  currentUrl?: string // Add this prop
}

export function ArticleTextBox({ 
  onValueChange, 
  onValidationChange,
  fileName, 
  ref,
  onError,
  currentUrl = "", // Add default value
}: ArticleTextBoxProps) {
  const [value, setValue] = useState("")

  const validateInput = useCallback((text: string): boolean => {
    const trimmedText = text.trim()
    const trimmedUrl = currentUrl.trim() // Use currentUrl from props

    // Always check for mutual exclusivity first
    if (trimmedText && trimmedUrl) {
      onError?.("Please provide either article text or URL, not both")
      onValidationChange?.(false)
      return false
    }

    // Only check length if we're using text and not URL
    if (trimmedText && !trimmedUrl) {
      if (trimmedText.length < MIN_LENGTH) {
        onError?.(`Text must be at least ${MIN_LENGTH.toString()} characters`)
        onValidationChange?.(false)
        return false
      }
      if (trimmedText.length > MAX_LENGTH) {
        onError?.(`Text cannot exceed ${MAX_LENGTH.toString()} characters`)
        onValidationChange?.(false)
        return false
      }
    }

    // Valid cases:
    // 1. Only URL is provided
    // 2. Only valid text is provided
    // 3. Nothing is provided (let parent handle this case)
    onError?.(null)
    onValidationChange?.(Boolean(trimmedUrl || (trimmedText && trimmedText.length >= MIN_LENGTH)))
    return true
  }, [currentUrl, onError, onValidationChange])

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setValue(newValue) // Simplified - no need for functional update
    onValueChange?.(newValue)
    validateInput(newValue)
  }, [validateInput, onValueChange])

  useEffect(() => {
    validateInput(value)
  }, [value, validateInput])

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="content">Article Text</Label>
        {fileName && <span className="text-sm text-primary">File: {fileName}</span>}
      </div>

      <div className="space-y-1">
        <Textarea
          ref={ref}
          id="content"
          placeholder="Paste or type the article text here or drag and drop a file..."
          value={value}
          onChange={handleChange}
          className={`min-h-[200px] resize-y`}
        />
        <p className="text-xs text-muted-foreground text-right">
          {value.length}/{MAX_LENGTH} characters
        </p>
      </div>
    </div>
  )
}

ArticleTextBox.displayName = "ArticleTextBox"