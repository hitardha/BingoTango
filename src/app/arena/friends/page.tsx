import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FriendsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Friends</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is where you will see your friends list, invite new friends, and manage friend requests.</p>
      </CardContent>
    </Card>
  );
}
