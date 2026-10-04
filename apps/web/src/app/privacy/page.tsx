import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
export const metadata = { title: "Privacy by design" };
export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="legal-page page-width" id="main-content">
        <p className="eyebrow">OUR FOUNDATION</p>
        <h1>
          Privacy <em>by design.</em>
        </h1>
        <p>
          This first milestone is a public website and sample story studio. It
          does not access your photo library, perform face recognition, create
          an account, or upload your memories.
        </p>
        <h2>The sample studio</h2>
        <p>
          Your selected people and written captions remain in this page’s
          temporary browser state. Refreshing or leaving the studio resets them.
          Nothing is sent to an API.
        </p>
        <h2>The product we are building</h2>
        <p>
          Photo indexing and selected-person matching will run on your device by
          default. Face embeddings and reference photos will stay in local
          encrypted storage. Cloud backup will require explicit consent and
          contain only selected content.
        </p>
        <h2>When cloud features arrive</h2>
        <p>
          Owner-scoped database policies, private media storage, short-lived
          signed links, export and deletion controls are part of the
          architecture. Sharing, AI, printing and backups are future features
          and are not enabled here.
        </p>
        <h2>Website requests</h2>
        <p>
          The website serves its own sample images and scripts. There are no
          analytics trackers or third-party font requests. A hosting provider
          may process normal request logs; retention and provider details must
          be documented before public launch.
        </p>
        <Link className="text-link" href="/">
          Return to MEMORA ↗
        </Link>
      </main>
    </>
  );
}
