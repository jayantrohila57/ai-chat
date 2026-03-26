import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function SidebarGetStartedCard() {
  return (
    <Card className="block gap-2 py-4 overflow-hidden shadow-none data-[state=open]:hidden">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-medium">Get Started</CardTitle>
        <CardDescription>Kick off your journey. Build faster. Ship smarter.</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-2.5">
          <Button size="sm">Start Now</Button>
        </div>
      </CardContent>
    </Card>
  );
}
