import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface BinaryDisplayProps {
  isFake: boolean;
}

export function BinaryDisplay({ isFake }: BinaryDisplayProps) {
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
              isFake ? "bg-red-500" : "bg-green-500",
            )}
          />
        </div>
      </div>

      {isFake ? <BadAlert /> : <GoodAlert />}

      <div className="text-sm text-muted-foreground">
        <p>
          Note: This is a simulated result for demonstration purposes.
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
      <AlertDescription>This article is likely to contain fake news.</AlertDescription>
    </Alert>
  );
}

function GoodAlert() {
  return (
    <Alert variant="default">
      <CheckCircle className="h-5 w-5 text-green-500" />
      <AlertTitle>Low Risk</AlertTitle>
      <AlertDescription>
        This article is likely to be reliable.
      </AlertDescription>
    </Alert>
  );
}
