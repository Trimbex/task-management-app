import type { Metadata } from "next";
import { SiteNav } from "@/components/ui/SiteNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Task dashboard, activity feed and reports",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
