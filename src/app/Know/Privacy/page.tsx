
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - BingoTango',
  description: 'Read the official Privacy Policy for the BingoTango platform. Understand how we collect, use, and protect your data in compliance with Indian and global laws.',
  keywords: ['BingoTango privacy', 'privacy policy', 'data protection', 'user data', 'information security', 'legal policy'],
};

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">{title}</h2>
        <div className="text-muted-foreground space-y-2">
            {children}
        </div>
    </div>
);

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-headline text-primary">Privacy Policy</h1>
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
        </header>

        <Card>
            <CardHeader>
                <CardTitle>BingoTango Privacy Policy</CardTitle>
                <CardDescription>Last Updated: 2025-10-19</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Section title="1. Introduction">
                    <p>Xenford Internet Private Limited ("Company," "we," "us," or "our") operates the BingoTango platform ("Platform"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform. We are committed to protecting your privacy and handling your data in an open and transparent manner.</p>
                </Section>
                
                <Section title="2. Information We Collect">
                    <p>We may collect information about you in a variety of ways. The information we may collect on the Platform includes:</p>
                    <p><strong>Personal Data:</strong> Personally identifiable information, such as your name, mobile number, email address, and date of birth, that you voluntarily give to us when you register for an account in the Arena.</p>
                    <p><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Platform, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Platform.</p>
                </Section>

                <Section title="3. How We Use Your Information">
                    <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Platform to:</p>
                    <ul className="list-disc list-inside ml-4">
                        <li>Create and manage your account.</li>
                        <li>Process transactions and manage your virtual wallet.</li>
                        <li>Monitor and analyze usage and trends to improve your experience with the Platform.</li>
                        <li>Notify you of updates to the Platform.</li>
                        <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
                        <li>Respond to product and customer service requests.</li>
                    </ul>
                </Section>

                <Section title="4. Information Sharing and Disclosure">
                    <p className="font-semibold text-foreground">We do not sell, rent, or intentionally share your personally identifiable information with any third parties for their marketing purposes.</p>
                    <p>Our Platform is designed to facilitate engagement between game creators and players without directly sharing personal contact information. Any interaction between users is managed through the Platform's features, which are designed to protect user privacy.</p>
                    <p>We may share information in the following limited situations:</p>
                     <ul className="list-disc list-inside ml-4">
                        <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
                        <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                    </ul>
                </Section>
                
                <Section title="5. Data Security">
                    <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
                </Section>

                <Section title="6. Your Rights (As per Indian and Global Laws)">
                    <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
                    <ul className="list-disc list-inside ml-4">
                        <li>The right to access – You have the right to request copies of your personal data.</li>
                        <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
                        <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
                    </ul>
                    <p>To exercise these rights, please contact us using the contact information provided below.</p>
                </Section>

                <Section title="7. Policy for Children">
                    <p>We do not knowingly solicit information from or market to children under the age of 18. If you become aware of any data we have collected from children under age 18, please contact us using the contact information provided below.</p>
                </Section>
                
                <Section title="8. Contact Us">
                     <p>If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:bingotango.com@gmail.com" className="font-semibold underline hover:text-primary">bingotango.com@gmail.com</a></p>
                </Section>
            </CardContent>
        </Card>

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
