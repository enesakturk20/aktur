import Sustainability from "@/components/Sustainability";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

const SustainabilityPage = async ({
  params,
}: {
    params: Promise<{ lang: string }>; // string olarak değiştirin
}) => {
  const resolvedParams = await params;
  const dictionary = await getDictionary(resolvedParams.lang as Locale); // as Locale ekleyin
  return (
    <>
      <Sustainability dictionary={dictionary.sustainabilityPage} />
    </>
  );
};

export default SustainabilityPage;