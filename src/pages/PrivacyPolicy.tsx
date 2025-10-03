import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_55%)]" />
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_bottom,_rgba(26,86,219,0.16),_transparent_55%)]" />

      <main className="relative z-10 px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-frost relative overflow-hidden rounded-3xl border border-white/10 p-8 shadow-2xl shadow-cyan-400/15 backdrop-blur-2xl md:p-12"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-transparent to-white/10" />
            <div className="relative space-y-8">
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold text-foreground">Privacy Policy</h1>
                <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>

              <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground">1. Introduction</h2>
                  <p>
                    Welcome to AgentRanked ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you join our waitlist.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground">2. Information We Collect</h2>
                  <p>When you join the AgentRanked waitlist, we collect the following information:</p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li><strong className="text-foreground">Email Address:</strong> We collect your email address to add you to our waitlist and communicate with you about beta access and product updates.</li>
                    <li><strong className="text-foreground">Referral Information:</strong> If you were referred by another user or if you refer others, we track referral codes to manage the waitlist queue and reward early supporters.</li>
                    <li><strong className="text-foreground">Technical Information:</strong> We may automatically collect certain technical information such as your IP address, browser type, and device information for security and analytics purposes.</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground">3. How We Use Your Information</h2>
                  <p>We use the information we collect for the following purposes:</p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>To manage our waitlist and grant beta access to eligible users</li>
                    <li>To send you updates about AgentRanked, including when beta access becomes available</li>
                    <li>To track and reward referrals</li>
                    <li>To improve our services and understand user interest</li>
                    <li>To communicate with you about our products and services</li>
                    <li>To comply with legal obligations and protect our rights</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground">4. Data Storage and Security</h2>
                  <p>
                    Your information is securely stored using industry-standard encryption and security practices. We use Supabase, a secure database platform, to store waitlist data. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground">5. Data Sharing and Disclosure</h2>
                  <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li><strong className="text-foreground">Service Providers:</strong> We may share data with trusted third-party service providers who assist us in operating our waitlist and communicating with users (e.g., email service providers).</li>
                    <li><strong className="text-foreground">Legal Requirements:</strong> We may disclose your information if required by law or in response to valid legal requests.</li>
                    <li><strong className="text-foreground">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity.</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground">6. Your Rights</h2>
                  <p>You have the following rights regarding your personal information:</p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li><strong className="text-foreground">Access:</strong> You can request access to the personal information we hold about you.</li>
                    <li><strong className="text-foreground">Correction:</strong> You can request that we correct any inaccurate information.</li>
                    <li><strong className="text-foreground">Deletion:</strong> You can request that we delete your information from our waitlist.</li>
                    <li><strong className="text-foreground">Opt-Out:</strong> You can unsubscribe from our communications at any time by clicking the unsubscribe link in our emails.</li>
                  </ul>
                  <p className="mt-3">
                    To exercise any of these rights, please contact us at <a href="mailto:privacy@agentranked.com" className="text-accent hover:underline">privacy@agentranked.com</a>.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground">7. Cookies and Tracking</h2>
                  <p>
                    We may use cookies and similar tracking technologies to enhance your experience on our website. These technologies help us remember your preferences and understand how you interact with our site. You can control cookie settings through your browser preferences.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground">8. Data Retention</h2>
                  <p>
                    We will retain your information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Once you are no longer on the waitlist or if you request deletion, we will securely delete or anonymize your data.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground">9. Children's Privacy</h2>
                  <p>
                    AgentRanked is not intended for children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground">10. International Data Transfers</h2>
                  <p>
                    Your information may be transferred to and stored on servers located outside of your country of residence. By joining our waitlist, you consent to the transfer of your information to countries that may have different data protection laws than your country.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground">11. Changes to This Privacy Policy</h2>
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on this page with a new "Last Updated" date. We encourage you to review this policy periodically.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-2xl font-semibold text-foreground">12. Contact Us</h2>
                  <p>
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
                  </p>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4 mt-3">
                    <p><strong className="text-foreground">Email:</strong> <a href="mailto:privacy@agentranked.com" className="text-accent hover:underline">privacy@agentranked.com</a></p>
                    <p className="mt-2"><strong className="text-foreground">Company:</strong> AgentRanked</p>
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
