import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface BinaryDisplayProps {
  isFake: boolean;
}

export function BinaryDisplay({ isFake }: BinaryDisplayProps) {
  // Determine color and icon based on score
  const getColorClass = () => {
    if (isFake) return "bg-red-500";
    return "bg-green-500";
  };

  const getIcon = () => {
    if (isFake) return <AlertCircle className="h-5 w-5 text-red-500" />;
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  const getAlertVariant = () => {
    if (isFake) return "destructive";
    return "default";
  };

  const getTitle = () => {
    if (isFake) return "High Risk";
    return "Low Risk";
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Analysis Results</h2>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Fake News Confidence</span>
        </div>
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              "h-full transition-all duration-500",
              getColorClass(),
            )}
          />
        </div>
      </div>

      <Alert variant={getAlertVariant()}>
        {getIcon()}
        <AlertTitle>{getTitle()}</AlertTitle>
      </Alert>

      <div className="text-sm text-muted-foreground">
        <p className="mb-2">
          Note: This is a simulated result for demonstration purposes.
        </p>
        <p>
          In a real application, this would use a trained machine learning model
          to analyze the content.
        </p>
      </div>
    </div>
  );
}
