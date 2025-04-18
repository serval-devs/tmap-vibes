import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCallback } from "react"

const MAX_WORDS = 5
const MAX_CHARS = 25

interface AuthorInputProps {
  value: string
  onChange: (value: string) => void
}

export function AuthorInput({ value, onChange }: AuthorInputProps) {
  const countWords = useCallback((text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }, [])
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let newText = e.target.value
    
    // First limit by characters
    if (newText.length > MAX_CHARS) {
      newText = newText.slice(0, MAX_CHARS)
    }
    
    // Then check word count
    const wordCount = countWords(newText)
    if (wordCount > MAX_WORDS) {
      // Keep only the first 5 words if limit is exceeded
      const words = newText.trim().split(/\s+/).filter(word => word.length > 0)
      newText = words.slice(0, MAX_WORDS).join(' ')
    }
    
    onChange(newText)
  }, [onChange, countWords])
  
  return (
    <div className="space-y-2">
      <Label htmlFor="author">
        Author 
        <span className="ml-2 text-xs text-muted-foreground">
        </span>
      </Label>
      <Input
        id="author"
        placeholder="Article author..."
        value={value}
        onChange={handleChange}
        maxLength={MAX_CHARS}
      />
      <div className="text-xs text-muted-foreground flex justify-end">
      </div>
    </div>
  )
}