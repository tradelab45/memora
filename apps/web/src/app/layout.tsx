import type { Metadata, Viewport } from "next";
import { MotionProvider } from "@/components/motion/motion-provider";
import "./globals.css";
import "./refinements.css";
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
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
