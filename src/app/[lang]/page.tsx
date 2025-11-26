import HeroSlider from '@/components/Hero';
import TransportServices from '@/components/TransportServices';
import { getDictionary } from './get-dictionary';
import { Locale } from './i18n-config';

export default async function Home({
  params,
}: {
  params: { lang: Locale }; // Promise'i kaldırın
}) {
  const dictionary = await getDictionary(params.lang); // Direkt params kullanın
  
  return (
    <>
      <HeroSlider dictionary={dictionary.heroSlider} />
      <TransportServices dictionary={dictionary.transportServices} lang={params.lang} />  
    </>
  );
}