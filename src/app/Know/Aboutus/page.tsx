
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';


export default function AboutPage() {

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-headline text-primary">About Us</h1>
                 <Button asChild variant="outline">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Link>
                </Button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
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
                
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Contact Us</CardTitle>
                            <CardDescription>Have a question or a proposal? Please reach out to us at our support email.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <p>For any inquiries, please email us at <a href="mailto:bingotango.com@gmail.com" className="font-semibold underline hover:text-primary">bingotango.com@gmail.com</a>.</p>
                           {/* 
                            Contact form has been temporarily disabled for debugging.
                           */}
                        </CardContent>
                    </Card>
                </div>
            </div>
             <footer className="mt-8 pt-8 border-t">
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <Link href="/Know/Aboutus" className="hover:text-primary">About Us</Link>
                    <Link href="/Know/Faq" className="hover:text-primary">FAQ</Link>
                    <Link href="/Know/Terms" className="hover:text-primary">Terms & Conditions</Link>
                    <Link href="/Know/Privacy" className="hover:text-primary">Privacy Policy</Link>
                    <Link href="/Know/Refunds" className="hover:text-primary">Returns & Refunds</Link>
                </div>
            </footer>
        </div>
    );
}
