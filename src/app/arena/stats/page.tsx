import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is where your personal and cumulative game statistics will be displayed.</p>
      </CardContent>
    </Card>
  );
}
