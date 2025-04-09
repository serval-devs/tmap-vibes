import { type ChangeEvent, useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ArticleTextBoxProps {
  initialValue?: string
  onValueChange?: (value: string) => void
  fileName?: string
  placeholder?: string
  ref?: React.Ref<HTMLTextAreaElement>
}

export function ArticleTextBox({ 
  initialValue = "", 
  onValueChange, 
  fileName, 
  placeholder,
  ref 
}: ArticleTextBoxProps) {
  const [value, setValue] = useState(initialValue)

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="content">Article Text</Label>
        {fileName && <span className="text-sm text-primary">File: {fileName}</span>}
      </div>

        <Textarea
          ref={ref}
          id="content"
          placeholder={placeholder ?? "Paste or type the article text here or drag and drop a file..."}
          value={value}
          onChange={handleChange}
          className="min-h-[200px] resize-y"
        />
      </div>
  )
}

ArticleTextBox.displayName = "ArticleTextBox"