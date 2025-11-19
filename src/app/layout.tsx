import './globals.css';
import Header from '../components/Header';
import WhatsAppButton from '../../public/icons/WhatsAppButton';
import type { ReactNode } from 'react';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Aktur Turizm',
  description: 'Kurumsal Turizm Çözümleri',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <Header />
        <main className="pt-22">{children}</main>
        <WhatsAppButton />
        <Footer />
      </body>
    </html>
  );
}
