import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enquête Famille - Recensement",
  description: "Formulaire de recensement familial",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
