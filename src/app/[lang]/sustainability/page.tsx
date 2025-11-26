import Sustainability from "@/components/Sustainability";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

const SustainabilityPage = async ({
  params,
}: {
    params: Promise<{ lang: Locale }>; // Promise olarak bırakın
}) => {
  const resolvedParams = await params; // await ile çözümleyin
  const dictionary = await getDictionary(resolvedParams.lang);
  return (
    <>
      <Sustainability dictionary={dictionary.sustainabilityPage} />
    </>
  );
};

export default SustainabilityPage;