import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: 'Regen Blog',
    template: 'Asli Nol Kalori',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
