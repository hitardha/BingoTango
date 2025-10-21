import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WalletPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is where you will manage your digital wallet, view balance, and handle transactions.</p>
      </CardContent>
    </Card>
  );
}
