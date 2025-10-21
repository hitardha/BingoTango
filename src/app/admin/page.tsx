import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
            <p className="text-muted-foreground">Overview of site activities and moderation tools.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Welcome, Admin!</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Use the navigation on the left to manage users, create games, and view reports.</p>
            </CardContent>
        </Card>
    </div>
  );
}
