import { type ChangeEvent, forwardRef } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ArticleTextBoxProps {
  value: string
  onChange: (value: string) => void
  fileName?: string
  placeholder?: string
}

export const ArticleTextBox = forwardRef<HTMLTextAreaElement, ArticleTextBoxProps>(
  ({ value, onChange, fileName, placeholder }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
    }

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="content">Article Text</Label>
          {fileName && <span className="text-sm text-primary">File: {fileName}</span>}
        </div>

        <div className="relative border rounded-md">
          <Textarea
            ref={ref}
            id="content"
            placeholder={placeholder ?? "Paste or type the article text here..."}
            value={value}
            onChange={handleChange}
            className="min-h-[200px] resize-y"
          />
        </div>
      </div>
    )
  }
)

ArticleTextBox.displayName = "ArticleTextBox"
