import type { Metadata } from "next";
import "./globals.css";

import GoogleAuthProvider from "../app/components/GoogleAuthProvider";

export const metadata: Metadata = {
  title: "SkillPrep AI | Build Your Career",
  description:
    "Build ATS-friendly resumes, practice technical interviews, and prepare for your next career opportunity with SkillPrep AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleAuthProvider>
          {children}
        </GoogleAuthProvider>
      </body>
    </html>
  );
}