import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HistoryPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Past Games</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is where you will see a history of all the games you have played.</p>
      </CardContent>
    </Card>
  );
}
