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
  params: { lang: Locale }; // ✅ Promise değil
}) {
  const dictionary = await getDictionary(params.lang);

  return (
    <html lang={params.lang}>
      <body>
        <Header dictionary={dictionary.header} lang={params.lang} />
        <main className="pt-22">{children}</main>
        <WhatsAppButton />
        <Footer
          dictionary={{ header: dictionary.header, footer: dictionary.footer }}
          lang={params.lang} // ✅ artık doğru tip
        />
      </body>
    </html>
  );
}
