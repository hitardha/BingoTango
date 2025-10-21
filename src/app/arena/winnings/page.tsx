import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WinningsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Winnings</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is where you will see a detailed breakdown of your winnings.</p>
      </CardContent>
    </Card>
  );
}
