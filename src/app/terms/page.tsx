import { Navbar } from '@/components/landing/Navbar'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-24 pb-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-surface-900 mb-2">TERMS OF SERVICE</h1>
                <p className="text-surface-600 mb-8">Last updated January 13, 2026</p>

                <div className="prose prose-slate max-w-none text-surface-600">
                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">1. SERVICE DESCRIPTION</h2>
                    <p className="mb-4">
                        HoteliaOS provides AI-powered review management tools for hotels. Our services include AI-generated review responses, guest email templates, and analytics dashboards intended to help independent hotels manage their online reputation.
                    </p>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">2. USER RESPONSIBILITIES</h2>
                    <p className="mb-4">
                        By using our Services, you agree to:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>Provide accurate, current, and complete information during registration.</li>
                        <li>Maintain the security of your password and accept all risks of unauthorized access to your account.</li>
                        <li>Use the Services only for lawful purposes and in accordance with these Terms.</li>
                        <li>Not use the generated content to mislead or defraud guests.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">3. AI PRODUCTS</h2>
                    <p className="mb-4">
                        Our Services utilize third-party artificial intelligence technologies, including those provided by Anthropic and Google Cloud AI. By using our AI features, you acknowledge that input data may be processed by these third-party providers. You agree not to use the AI features to generate harmful, illegal, or abusive content.
                    </p>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">4. PAYMENT DATA</h2>
                    <p className="mb-4">
                        Secure payment processing is provided by Stripe. We do not store your full credit card details on our servers. You can view Stripe's privacy policy at <a href="https://stripe.com/en-sg/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">https://stripe.com/en-sg/privacy</a>.
                    </p>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">5. PAYMENTS & REFUNDS</h2>
                    <p className="mb-4">
                        <strong>Subscriptions:</strong> HoteliaOS is billed on a monthly subscription basis.
                    </p>
                    <p className="mb-4">
                        <strong>Cancellation:</strong> You may cancel your subscription at any time via your account settings. Your access will continue until the end of the current billing period.
                    </p>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">6. ACCOUNT TERMINATION</h2>
                    <p className="mb-4">
                        You may terminate your account at any time. Upon termination, we will deactivate your account. We reserve the right to delete your data from our active databases following termination, subject to our Privacy Policy and legal retention requirements. We may also terminate or suspend your account if you violate these Terms.
                    </p>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">7. LIMITATION OF LIABILITY</h2>
                    <p className="mb-4">
                        THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY LAW, HOTELIAOS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
                    </p>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">8. UPDATES TO TERMS</h2>
                    <p className="mb-4">
                        We reserve the right to modify these Terms at any time. We will provide notice of material changes via email or through the Services. Your continued use of the Services following such changes constitutes your acceptance of the new Terms.
                    </p>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">9. CONTACT</h2>
                    <p className="mb-4">
                        If you have any questions about these Terms, please contact us at <a href="mailto:support@hoteliaos.com" className="text-brand-600 hover:underline">support@hoteliaos.com</a>.
                    </p>
                    <p className="mb-4 text-surface-700">
                        Hotelia OS<br />
                        A-5-9, Level 5, Block A, Empire Tower<br />
                        Jalan SS16/1, Ss 16<br />
                        Subang Jaya, Selangor 47500<br />
                        Malaysia
                    </p>
                </div>
            </main>
            <footer className="py-8 text-center text-sm text-surface-500 border-t border-surface-100">
                © 2026 HoteliaOS. All rights reserved.
            </footer>
        </div>
    )
}
