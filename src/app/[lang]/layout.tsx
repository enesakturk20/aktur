import './globals.css';
import Header from '@/components/Header';
import WhatsAppButton from '../../../public/icons/WhatsAppButton';
import type { ReactNode } from 'react';
import Footer from '@/components/Footer';
import { getDictionary } from './get-dictionary';
import { Locale } from './i18n-config';

export const metadata = {
  title: 'Aktur Turizm',
  description: 'Kurumsal Turizm Çözümleri',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const resolvedParams = await params;
  const dictionary = await getDictionary(resolvedParams.lang);

  return (
    <html lang={resolvedParams.lang}>
      <body>
        <Header dictionary={dictionary.header} lang={resolvedParams.lang} />
        <main className="pt-22">{children}</main>
        <WhatsAppButton />
        <Footer dictionary={{ header: dictionary.header, footer: dictionary.footer }} lang={resolvedParams.lang} />
      </body>
    </html>
  );
}