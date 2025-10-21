import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-headline text-primary">About Us</h1>
                 <Button asChild variant="outline">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Link>
                </Button>
            </header>

            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Our Mission</CardTitle>
                    </CardHeader>
                    <CardContent className="text-lg text-muted-foreground space-y-4">
                        <p>
                            <strong className="text-primary font-headline tracking-wide">BingoTango</strong> is a Bingo-based marketing solution built for businesses to engage more with their customers in a fun and interactive way.
                        </p>
                        <p>
                            It is a proud product of <strong className="font-semibold text-foreground">Xenford Internet Private Limited</strong>.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
