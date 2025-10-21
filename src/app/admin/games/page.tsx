import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminGamesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Create & Manage Games</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is where administrators will create new bingo games, set prize pools, and manage game schedules.</p>
      </CardContent>
    </Card>
  );
}
