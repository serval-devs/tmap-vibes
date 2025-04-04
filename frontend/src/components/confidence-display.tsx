import { AlertCircle, CheckCircle, HelpCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface ConfidenceDisplayProps {
  score: number
  message: string
}

export function ConfidenceDisplay({ score, message }: ConfidenceDisplayProps) {
  // Convert score to percentage
  const percentage = Math.round(score * 100)

  // Determine color and icon based on score
  const getColorClass = () => {
    if (score < 0.3) return "bg-green-500"
    if (score < 0.7) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getIcon = () => {
    if (score < 0.3) return <CheckCircle className="h-5 w-5 text-green-500" />
    if (score < 0.7) return <HelpCircle className="h-5 w-5 text-yellow-500" />
    return <AlertCircle className="h-5 w-5 text-red-500" />
  }

  const getAlertVariant = () => {
    if (score < 0.3) return "default"
    return "destructive"
  }

  const getTitle = () => {
    if (score < 0.3) return "Low Risk"
    if (score < 0.7) return "Medium Risk"
    return "High Risk"
  }

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-300">
      <h2 className="text-xl font-semibold">Analysis Results</h2>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Fake News Confidence</span>
          <span className="text-sm font-bold">{percentage}%</span>
        </div>
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn("h-full transition-all duration-500", getColorClass())}
            style={{ width: `${percentage.toString()}%` }}
          />
        </div>
      </div>

      <Alert variant={getAlertVariant()}>
        {getIcon()}
        <AlertTitle>{getTitle()}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>

      <div className="text-sm text-muted-foreground">
        <p className="mb-2">Note: This is a simulated result for demonstration purposes.</p>
        <p>In a real application, this would use a trained machine learning model to analyze the content.</p>
      </div>
    </div>
  )
}
