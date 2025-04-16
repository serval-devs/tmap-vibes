import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AuthorInputProps {
  value: string
  onChange: (value: string) => void
}

export function AuthorInput({ value, onChange }: AuthorInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="author">Author</Label>
      <Input
        id="author"
        placeholder="Article author..."
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
        }}
      />
    </div>
  )
}