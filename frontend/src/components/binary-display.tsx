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

      {isFake ? <BadAlert /> : <GoodAlert />}

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

function BadAlert() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-5 w-5 text-red-500" />
      <AlertTitle>High Risk</AlertTitle>
      <p>This article is likely to contain fake news.</p>
    </Alert>
  );
}

function GoodAlert() {
  return (
    <Alert variant="default">
      <CheckCircle className="h-5 w-5 text-green-500" />
      <AlertTitle>Low Risk</AlertTitle>
      <p>This article is likely to be reliable.</p>
    </Alert>
  );
}
