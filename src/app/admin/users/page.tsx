import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminUsersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">User Behavior Review</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is where moderators will review user behavior, handle reports, and manage player accounts (e.g., ban players).</p>
      </CardContent>
    </Card>
  );
}
