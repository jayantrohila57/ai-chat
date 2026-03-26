import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface DataTableErrorProps {
  error?: Error | string;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

export function DataTableError({ error, onRetry, title, description }: DataTableErrorProps) {
  const errorMessage = typeof error === "string" ? error : error?.message;

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="flex max-w-md flex-col items-center space-y-4 text-center">
          <div className="bg-destructive/10 rounded-full p-4">
            <AlertTriangle className="text-destructive h-8 w-8" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-lg">{title || "Error"}</CardTitle>
            <CardDescription className="text-center">
              {description || "An error occurred while loading the data."}
            </CardDescription>
            {errorMessage && <p className="text-muted-foreground bg-muted rounded-md p-2 text-sm">{errorMessage}</p>}
          </div>

          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
