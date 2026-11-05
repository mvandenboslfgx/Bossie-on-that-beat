import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Privacy & Data Protection",
  description: "Privacy information for Bossie on that beat: music enquiries, website analytics, data rights and contact details.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <section className="page-hero">
        <div className="page-shell">
          <p className="eyebrow">PRIVACY / DATA PROTECTION</p>
          <h1>YOUR BRIEF.<br />YOUR DATA.</h1>
          <p>What happens to information you share when you visit Bossie on that beat or request a music project.</p>
        </div>
      </section>
      <section className="page-section">
        <div className="page-shell legal-copy">
          <p>Last updated: 5 November 2026.</p>
          <h2>Who is responsible?</h2>
          <p>
            This website and its project requests are operated by VDB Digital Software (Netherlands;
            Dutch Chamber of Commerce registration 99981440), trading through the Bossie on that beat music project.
            For privacy requests, email <a href="mailto:algemeen@vdbdigital.nl">algemeen@vdbdigital.nl</a>.
          </p>
          <h2>What we collect</h2>
          <p>
            When you submit a project enquiry, we process the name, email address, optional company and country,
            project type, musical preferences, brief, reference links, deadline and budget indication you choose to provide.
            We also record when you agreed to the form's privacy notice.
          </p>
          <h2>Why we use this information</h2>
          <p>
            We use request information to review your enquiry, contact you, prepare a proposal, and — if you proceed —
            administer the project. Depending on the circumstances, processing is necessary to take steps before a contract
            or for our legitimate interest in responding to enquiries and operating the business.
          </p>
          <h2>Storage and service providers</h2>
          <p>
            Requests are stored in the website's Cloudflare D1 database. We use Resend to deliver request notifications
            by email. Cloudflare provides website infrastructure; Metricool provides website analytics. These providers
            may process limited data on our behalf according to their applicable service terms.
          </p>
          <h2>Website analytics and external links</h2>
          <p>
            Metricool helps us understand visits and general website usage. Pages may also link to Spotify, Apple Music,
            YouTube and other independent services; their privacy practices apply once you visit those services.
            Any analytics preferences or cookie requirements are assessed against the tracker configuration in use.
          </p>
          <h2>How long data is kept</h2>
          <p>
            We retain enquiries for as long as reasonably necessary to respond, manage a possible collaboration, resolve
            disputes and meet applicable recordkeeping obligations. Unnecessary information should not be retained
            indefinitely. You can request an assessment or deletion of an old enquiry using the contact address above.
          </p>
          <h2>Your privacy rights</h2>
          <p>
            Depending on applicable law, you may request access, correction, deletion, restriction, data portability
            or object to certain processing. You can also withdraw consent where consent is the legal basis.
            Write to the privacy contact above; we may need to verify your identity before acting on a request.
            You may lodge a complaint with the Dutch Data Protection Authority
            (Autoriteit Persoonsgegevens) at <a href="https://autoriteitpersoonsgegevens.nl/" target="_blank" rel="noopener noreferrer">autoriteitpersoonsgegevens.nl</a>.
          </p>
          <h2>International processing</h2>
          <p>
            Some service providers may process information outside the European Economic Area. Where applicable,
            we assess the required legal safeguards, including contractual protections, before relying on such transfers.
          </p>
          <h2>Please do not send sensitive files in the first enquiry</h2>
          <p>
            Do not include passwords, payment-card details, confidential master recordings or highly sensitive personal
            data in an initial brief. Secure exchange options can be agreed after the first contact.
          </p>
          <h2>Questions or a project request?</h2>
          <p>For privacy questions use <a href="mailto:algemeen@vdbdigital.nl">algemeen@vdbdigital.nl</a>. For new music briefs, use the dedicated form.</p>
          <Link className="gold-link" href="/request">Create a project request ↗</Link>
        </div>
      </section>
    </PageShell>
  );
}
