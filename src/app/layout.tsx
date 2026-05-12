// Root layout - required by Next.js but locale routing is handled in [locale]/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
