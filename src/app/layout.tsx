export const metadata = {
  title: "SaaS Notes",
};

import "./globals.css";
import Navbar from "../components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="container-page">{children}</div>
      </body>
    </html>
  );
}
