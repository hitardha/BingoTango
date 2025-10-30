
"use client";

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import { RecaptchaVerifier } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';
import { sendContactMessage } from '@/app/actions';

const contactSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    message: z.string().min(10, { message: "Message must be at least 10 characters." }),
    captcha: z.boolean().refine(val => val === true, {
        message: "Please complete the CAPTCHA.",
    }),
});

export default function AboutPage() {
    const { toast } = useToast();
    const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const auth = useAuth();

    const formMethods = useForm<z.infer<typeof contactSchema>>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
            captcha: false,
        },
    });
    
    useEffect(() => {
        let verifier: RecaptchaVerifier | null = null;
        if (auth && recaptchaContainerRef.current && !recaptchaContainerRef.current.hasChildNodes()) {
            try {
                verifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
                    'size': 'normal',
                    'callback': () => {
                        formMethods.setValue('captcha', true, { shouldValidate: true });
                    },
                    'expired-callback': () => {
                        formMethods.setValue('captcha', false, { shouldValidate: true });
                    }
                });
                verifier.render();
                (window as any).recaptchaVerifierContact = verifier;
            } catch (e) {
                console.error("Error rendering reCAPTCHA", e);
            }
        }

        return () => {
             if ((window as any).recaptchaVerifierContact) {
                try {
                   (window as any).recaptchaVerifierContact.clear();
                } catch (e) {
                   console.warn("Could not clear reCAPTCHA verifier.", e);
                }
            }
        }
    }, [auth, formMethods]);


    async function onSubmit(values: z.infer<typeof contactSchema>) {
        setIsSubmitting(true);
        
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('message', values.message);

        try {
            const result = await sendContactMessage(formData);
            
            if (result.success) {
                toast({
                    title: "Message Sent!",
                    description: result.message,
                });
                formMethods.reset();
                 if ((window as any).grecaptcha) {
                    try {
                        (window as any).grecaptcha.reset();
                        formMethods.setValue('captcha', false);
                    } catch (e) {
                        console.error("Error resetting reCAPTCHA", e);
                    }
                }
            } else {
                toast({
                    title: "Submission Error",
                    description: result.message || "An unknown error occurred.",
                    variant: "destructive",
                });
            }
        } catch (e) {
            const error = e as Error;
            toast({
                title: "Submission Failed",
                description: error.message || "Could not send the message.",
                variant: "destructive",
            });
        }

        setIsSubmitting(false);
    }

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
                            <CardDescription>Have a question or a proposal? Send us a message!</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <FormProvider {...formMethods}>
                                <Form {...formMethods}>
                                    <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-6">
                                        <FormField
                                            control={formMethods.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Your Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="John Doe" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={formMethods.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Your Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="you@example.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={formMethods.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Message</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="How can we help you?" {...field} rows={5} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={formMethods.control}
                                            name="captcha"
                                            render={() => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div ref={recaptchaContainerRef}></div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                                            {isSubmitting ? 'Sending...' : 'Send Message'}
                                            <Send className="ml-2 h-4 w-4" />
                                        </Button>
                                    </form>
                                </Form>
                             </FormProvider>
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

    