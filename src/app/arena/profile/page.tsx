import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is where your personal profile information will be displayed and can be edited.</p>
      </CardContent>
    </Card>
  );
}
