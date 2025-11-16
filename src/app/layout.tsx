import './globals.css';
import Header from '../components/Header';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Aktur Turizm',
  description: 'Kurumsal Turizm Çözümleri',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <Header />
        <main className="pt-24">{children}</main>
      </body>
    </html>
  );
}
