import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCallback } from "react"

interface WebsiteInputProps {
  value: string
  onChange: (value: string) => void
}

export function WebsiteInput({ value, onChange }: WebsiteInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Limit to 25 characters maximum
      const newValue = e.target.value.slice(0, 25)
      onChange(newValue)
    },
    [onChange]
  )

  return (
    <div className="space-y-2">
      <Label htmlFor="website">Website <span className="text-xs text-muted-foreground"></span></Label>
      <Input
        id="website"
        placeholder="Source website..."
        value={value}
        onChange={handleChange}
        maxLength={25}
      />
    </div>
  )
}