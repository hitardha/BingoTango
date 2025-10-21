import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TicketsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Game Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is where you will view your active and upcoming game tickets.</p>
      </CardContent>
    </Card>
  );
}
