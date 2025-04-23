import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Card, CardTitle } from "@/components/ui/card";

interface BinaryDisplayProps {
  isFake: boolean;
}

export function BinaryDisplay({ isFake }: BinaryDisplayProps) {
  return (
    <Card className="animate-in fade-in-50 duration-300 p-4">
      <CardTitle>Fake News Confidence</CardTitle>
      <div className="space-y-4">
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
          <p>Note: This is a simulated result for demonstration purposes.</p>
        </div>
    </Card>
  );
}

function BadAlert() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-5 w-5 text-red-500" />
      <AlertTitle>High Risk</AlertTitle>
      <AlertDescription>
        This article is likely to contain fake news.
      </AlertDescription>
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
