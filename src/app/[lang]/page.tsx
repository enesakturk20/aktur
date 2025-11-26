import HeroSlider from '@/components/Hero';
import TransportServices from '@/components/TransportServices';
import { getDictionary } from './get-dictionary';
import { Locale } from './i18n-config';

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const resolvedParams = await params;
  const dictionary = await getDictionary(resolvedParams.lang);
  
  return (
    <>
      <HeroSlider dictionary={dictionary.heroSlider} />
      <TransportServices dictionary={dictionary.transportServices} lang={resolvedParams.lang} />  
    </>
  );
}