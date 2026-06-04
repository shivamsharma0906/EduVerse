import type { Metadata } from "next";
import "./globals.css";
import ClientLayoutWrapper from "./ClientLayoutWrapper";

export const metadata: Metadata = {
  title: "EduVerse AI — Education Operating System",
  description: "AI-native education operating system unifying personalized learning, intelligent tools, and talent discovery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#0A0A0F] text-white antialiased flex flex-col">
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
