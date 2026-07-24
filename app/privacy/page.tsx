import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Executive Function OS handles authentication data. All behavioral analysis runs client-side; no raw interaction data leaves your device.',
}

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
      <p className="mb-4">
        When you use our application to log in via Google OAuth, we only request and use
        the basic profile information and email address necessary to authenticate your account
        and provide you with our services.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
      <p className="mb-4">
        We use the information collected solely for the purpose of maintaining your account
        and providing the intended functionality of the application. We do not sell, rent,
        or share your personal information with third parties for marketing purposes.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">3. Data Security</h2>
      <p className="mb-4">
        We implement basic industry-standard security measures to protect your data.
        However, please be aware that no method of transmission over the internet or
        electronic storage is 100% secure.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">4. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this privacy policy from time to time. We will notify you of any changes
        by posting the new privacy policy on this page.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
      <p className="mb-4">
        If you have any questions about this Privacy Policy, please contact us.
      </p>
    </div>
  );
}
