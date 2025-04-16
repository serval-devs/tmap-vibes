import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface WebsiteInputProps {
  value: string
  onChange: (value: string) => void
}

export function WebsiteInput({ value, onChange }: WebsiteInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="website">Website</Label>
      <Input
        id="website"
        placeholder="Source website..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}