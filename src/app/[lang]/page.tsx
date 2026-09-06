import type { Metadata } from 'next';
import HeroSlider from '@/components/Hero';
import TransportServices from '@/components/TransportServices';
import { getDictionary } from './get-dictionary';
import { Locale } from './i18n-config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const dictionary = await getDictionary(resolvedParams.lang);
  const metadataDict = (dictionary as any).metadata;

  return {
    title: metadataDict?.homeTitle || 'Aktur Turizm',
    description: metadataDict?.homeDescription || 'Kurumsal Turizm Çözümleri',
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>; // Promise olarak değiştirin
}) {
  const resolvedParams = await params; // await ile çözümleyin
  const dictionary = await getDictionary(resolvedParams.lang);
  
  return (
    <>
      <HeroSlider dictionary={dictionary.heroSlider} />
      <TransportServices dictionary={dictionary.transportServices} lang={resolvedParams.lang} />  
    </>
  );
}