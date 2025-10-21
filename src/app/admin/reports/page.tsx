import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is where administrators will view financial reports, player activity logs, and other site analytics.</p>
      </CardContent>
    </Card>
  );
}
