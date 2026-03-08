import React from 'react';

export const metadata = {
    title: 'Privacy Policy',
    description: 'Privacy Policy for Intellivance consulting services and marketing communications.',
};

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#000000] text-[#E0E0E0] py-24 selection:bg-[#4A90E2] selection:text-white">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-light text-white mb-12 tracking-tight">
                    Privacy Policy
                </h1>

                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-light prose-headings:tracking-tight prose-a:text-[#4A90E2] hover:prose-a:text-[#FFFFFF] prose-a:transition-colors">
                    <p className="text-[#A0A0A0] mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                    <section className="mb-12">
                        <h2 className="text-2xl text-white mb-6">1. Information We Collect</h2>
                        <p className="mb-4">
                            At Intellivance, we collect information that you provide directly to us when you fill out a form, request an assessment, or otherwise communicate with us. This may include:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-[#A0A0A0]">
                            <li>Name and Job Title</li>
                            <li>Company Name</li>
                            <li>Email address and Phone number</li>
                            <li>Information regarding your business operations and automation needs</li>
                        </ul>
                        <p>
                            We also automatically collect certain information about your device and how you interact with our website, including IP address, browser type, and pages visited, through the use of cookies and tracking technologies (such as the Meta Pixel and Google Tags) to improve our marketing efforts.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl text-white mb-6">2. How We Use Your Information</h2>
                        <p className="mb-4">We use the information we collect to:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-[#A0A0A0]">
                            <li>Provide, maintain, and improve our consulting services</li>
                            <li>Communicate with you about products, services, offers, and events</li>
                            <li>Process transactions and send related information</li>
                            <li>Monitor and analyze trends, usage, and activities in connection with our website</li>
                            <li>Personalize the advertisements you see on third-party platforms (e.g., Meta, Google, LinkedIn)</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl text-white mb-6">3. Tracking & Advertising</h2>
                        <p className="mb-4">
                            We use third-party advertising tools, such as the Meta Pixel and Google Ads tracking, to deliver targeted advertisements to users who have visited our website or to lookalike audiences. These tools use cookies and similar technologies to collect data about your online activities. You can opt out of targeted advertising through your device settings or via relevant third-party opt-out portals.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl text-white mb-6">4. Data Sharing & Security</h2>
                        <p className="mb-4">
                            We do not sell your personal information. We may share your information with trusted third-party vendors, consultants, and service providers who need access to such information to carry out work on our behalf. We implement standard security measures to protect your personal information from unauthorized access or disclosure.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl text-white mb-6">5. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hello@intellivance.co">hello@intellivance.co</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
