import { Navbar } from '@/components/landing/Navbar'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-24 pb-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-surface-900 mb-2">PRIVACY POLICY</h1>
                <p className="text-surface-600 mb-8">Last updated January 13, 2026</p>

                <div className="prose prose-slate max-w-none text-surface-600">
                    <p className="mb-4">
                        This Privacy Notice for <strong>Hotelia OS</strong> ("<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>"), describes how and why we might access, collect, store, use, and/or share ("<strong>process</strong>") your personal information when you use our services ("<strong>Services</strong>"), including when you visit our website at <a href="https://hoteliaos.com" className="text-brand-600 hover:underline">https://hoteliaos.com</a>.
                    </p>

                    <p className="mb-8">
                        <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <a href="mailto:privacy@hoteliaos.com" className="text-brand-600 hover:underline">privacy@hoteliaos.com</a>.
                    </p>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">SUMMARY OF KEY POINTS</h2>
                    <ul className="list-disc pl-5 space-y-2 mb-8">
                        <li><strong>What personal information do we process?</strong> We may process personal information depending on how you interact with us and the Services.</li>
                        <li><strong>Do we process any sensitive personal information?</strong> We do not process sensitive personal information.</li>
                        <li><strong>Do we collect any information from third parties?</strong> We do not collect any information from third parties.</li>
                        <li><strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</li>
                        <li><strong>How do we keep your information safe?</strong> We have adequate organizational and technical processes and procedures in place to protect your personal information.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">1. WHAT INFORMATION DO WE COLLECT?</h2>
                    <h3 className="text-xl font-semibold text-surface-900 mt-6 mb-2">Personal information you disclose to us</h3>
                    <p className="mb-4">We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>Names</li>
                        <li>Email addresses</li>
                        <li>Passwords</li>
                    </ul>
                    <p className="mb-4"><strong>Payment Data.</strong> We may collect data necessary to process your payment if you choose to make purchases, such as your payment instrument number. All payment data is handled and stored by Stripe. You may find their privacy notice link here: <a href="https://stripe.com/en-sg/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">https://stripe.com/en-sg/privacy</a>.</p>

                    <h3 className="text-xl font-semibold text-surface-900 mt-6 mb-2">Information automatically collected</h3>
                    <p className="mb-4">We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information.</p>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
                    <p className="mb-4">We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>To facilitate account creation and authentication and otherwise manage user accounts.</li>
                        <li>To respond to user inquiries/offer support to users.</li>
                        <li>To send administrative information to you.</li>
                        <li>To fulfill and manage your orders.</li>
                        <li>To request feedback.</li>
                        <li>To protect our Services.</li>
                        <li>To evaluate and improve our Services, products, marketing, and your experience.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2>
                    <p className="mb-4">We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work. Categories of third parties include:</p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li>Cloud Computing Services (Google Cloud, Supabase)</li>
                        <li>Payment Processors (Stripe)</li>
                        <li>AI Service Providers (Anthropic, Google Cloud AI)</li>
                        <li>Email Service Providers</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
                    <p className="mb-4">We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.</p>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">5. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?</h2>
                    <p className="mb-4">We offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies ("AI Products"). We provide the AI Products through third-party service providers, including Anthropic and Google Cloud AI. Your input, output, and personal information will be shared with and processed by these AI Service Providers to enable your use of our AI Products.</p>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">6. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</h2>
                    <p className="mb-4">If you choose to register or log in to our Services using a social media account, we may have access to certain information about you. We recommend that you review their privacy notice to understand how they collect, use, and share your personal information.</p>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">7. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
                    <p className="mb-4">We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law. No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.</p>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">8. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
                    <p className="mb-4">We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">9. DO WE COLLECT INFORMATION FROM MINORS?</h2>
                    <p className="mb-4">We do not knowingly collect, solicit data from, or market to children under 18 years of age. By using the Services, you represent that you are at least 18.</p>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">10. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
                    <p className="mb-4">You may review, change, or terminate your account at any time. Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases.</p>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">11. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
                    <p className="mb-4">We do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.</p>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">12. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
                    <p className="mb-4">Yes, we will update this notice as necessary to stay compliant with relevant laws. The updated version will be indicated by an updated "Revised" date at the top of this Privacy Notice.</p>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">13. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
                    <p className="mb-4">If you have questions or comments about this notice, you may email us at <a href="mailto:privacy@hoteliaos.com" className="text-brand-600 hover:underline">privacy@hoteliaos.com</a> or contact us by post at:</p>
                    <p className="mb-4 text-surface-700">
                        Hotelia OS<br />
                        A-5-9, Level 5, Block A, Empire Tower<br />
                        Jalan SS16/1, Ss 16<br />
                        Subang Jaya, Selangor 47500<br />
                        Malaysia
                    </p>

                    <h2 className="text-2xl font-bold text-surface-900 mt-8 mb-4">14. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2>
                    <p className="mb-4">Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, change that information, or delete it. To request to review, update, or delete your personal information, please submit a request to <a href="mailto:privacy@hoteliaos.com" className="text-brand-600 hover:underline">privacy@hoteliaos.com</a>.</p>
                </div>
            </main>
            <footer className="py-8 text-center text-sm text-surface-500 border-t border-surface-100">
                © 2026 HoteliaOS. All rights reserved.
            </footer>
        </div>
    )
}
