import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/auth/auth-provider";
import { MotionProvider } from "@/components/motion/motion-provider";
import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/cormorant-garamond/latin-600-italic.css";
import "./fonts.css";
import "./globals.css";
import "./refinements.css";
import { CursorLight } from "@/components/ui/cursor-light";
import { SongPick } from "@/components/music/song-pick";

export const metadata: Metadata = {
  title: {
    default: "MEMORA — Your life. Remembered properly.",
    template: "%s · MEMORA",
  },
  description:
    "The people you love. The moments in between. Turn everyday photos into stories worth keeping with MEMORA.",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#f8f5ee" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <CursorLight />
        <SongPick />
        <AuthProvider><MotionProvider>{children}</MotionProvider></AuthProvider>
      </body>
    </html>
  );
}
