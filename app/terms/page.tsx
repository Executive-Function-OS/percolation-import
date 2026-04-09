export default function TermsOfService() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
      <p className="mb-4">
        By accessing and using this application, you accept and agree to be bound by the terms
        and provision of this agreement.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">2. Use License</h2>
      <p className="mb-4">
        Permission is granted to temporarily use the application for your personal,
        non-commercial transitory viewing only. This is the grant of a license, not a transfer
        of title.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">3. Disclaimer</h2>
      <p className="mb-4">
        The materials on the application are provided on an &apos;as is&apos; basis. We make no
        warranties, expressed or implied, and hereby disclaim and negate all other warranties
        including, without limitation, implied warranties or conditions of merchantability,
        fitness for a particular purpose, or non-infringement of intellectual property or
        other violation of rights.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">4. Limitations</h2>
      <p className="mb-4">
        In no event shall we or our suppliers be liable for any damages (including, without
        limitation, damages for loss of data or profit, or due to business interruption) arising
        out of the use or inability to use the application.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
      <p className="mb-4">
        If you have any questions about these Terms, please contact us.
      </p>
    </div>
  );
}
