import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pages = [
  { href: "goals", label: "Goals" },
  { href: "equipment-types", label: "Equipment Types" },
  { href: "activity-types", label: "Activity Types" },
  { href: "add-activity-type", label: "Add Activity Type" },
  { href: "add-equipment-types", label: "Add Equipment Types" },
  { href: "distance-measurements", label: "Distance Measurements" },
];

export const metadata: Metadata = {
  title: "Workout Calendar",
  description: "Workout calendar to track training and preperation for goals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {" "}
        <nav>
          {pages.map((page) => (
            <a className="pr-5" key={page.href} href={`/${page.href}`}>
              {page.label}
            </a>
          ))}
        </nav>
        {children}
      </body>
    </html>
  );
}
