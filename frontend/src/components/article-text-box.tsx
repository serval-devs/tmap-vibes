import { type ChangeEvent, useState, useEffect, useCallback } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const MAX_LENGTH = 5000
const MIN_LENGTH = 10

interface ArticleTextBoxProps {
  initialValue?: string
  onValueChange?: (value: string) => void
  onValidationChange?: (isValid: boolean) => void
  fileName?: string
  placeholder?: string
  ref?: React.Ref<HTMLTextAreaElement>
  currentUrl?: string // Add this prop
  onError?: (error: string | null) => void
}

export function ArticleTextBox({ 
  initialValue = "", 
  onValueChange, 
  onValidationChange,
  fileName, 
  placeholder,
  ref,
  currentUrl = "", // Add this prop with default
  onError,
}: ArticleTextBoxProps) {
  const [value, setValue] = useState(initialValue)
  
  const validateInput = useCallback((text: string): boolean => {
    const validation = () => {
      const trimmedText = text.trim();
      const trimmedUrl = currentUrl.trim();

      // Both text and URL are empty - invalid state
      if (!trimmedText && !trimmedUrl) {
        return {
          error: null,
          isValid: false
        }
      }

      // Only URL is provided - valid state
      if (!trimmedText && trimmedUrl) {
        return {
          error: null,
          isValid: true
        }
      }

      // Text is provided - check length and URL conflict
      if (trimmedText) {
        // Check for URL conflict first
        if (trimmedUrl) {
          return {
            error: "Please provide either article text or URL, not both",
            isValid: false
          }
        }

        // Check length requirements
        if (text.length < MIN_LENGTH) {
          return {
            error: `Text must be at least ${MIN_LENGTH.toString()} characters`,
            isValid: false
          }
        }
        if (text.length > MAX_LENGTH) {
          return {
            error: `Text cannot exceed ${MAX_LENGTH.toString()} characters`,
            isValid: false
          }
        }
      }

      return {
        error: null,
        isValid: true
      }
    }

    const result = validation()
    onError?.(result.error)  // Pass error up instead of setting local state
    onValidationChange?.(result.isValid)
    return result.isValid
  }, [currentUrl, onValidationChange, onError])

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setValue(() => newValue)
    if (validateInput(newValue)) {
      onValueChange?.(newValue)
    }
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
          placeholder={placeholder ?? "Paste or type the article text here or drag and drop a file..."}
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