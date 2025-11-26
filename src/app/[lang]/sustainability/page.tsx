import Sustainability from "@/components/Sustainability";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

const SustainabilityPage = async ({
  params,
}: {
    params: Promise<{ lang: Locale }>;
}) => {
  const resolvedParams = await params;
   const dictionary = await getDictionary(resolvedParams.lang);
  return (
    <>
      <Sustainability dictionary={dictionary.sustainabilityPage} />
    </>
  );
};

export default SustainabilityPage;