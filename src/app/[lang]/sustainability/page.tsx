import Sustainability from "@/components/Sustainability";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

const SustainabilityPage = async ({
  params,
}: {
    params: { lang: Locale }; // Promise'i kaldırın
}) => {
  const dictionary = await getDictionary(params.lang); // Direkt params kullanın
  return (
    <>
      <Sustainability dictionary={dictionary.sustainabilityPage} />
    </>
  );
};

export default SustainabilityPage;