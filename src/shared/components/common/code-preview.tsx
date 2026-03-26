"use client";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export default function CodePreview({ json }: { json: unknown }) {
  const code = JSON.stringify(json, null, 6);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="flex items-center justify-between gap-4">
        <CardTitle className="text-sm font-medium">JSON Preview</CardTitle>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={handleCopy}>
            Copy
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <pre className="overflow-auto bg-transparent p-4 font-mono text-sm whitespace-pre-wrap">{code}</pre>
      </CardContent>
    </Card>
  );
}
