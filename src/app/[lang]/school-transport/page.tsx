import SchoolTransport from "@/components/SchoolTransport";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

const SchoolTransportPage = async ({
  params,
}: {
  params: { lang: Locale }; // Promise'i kaldırın
}) => {
  const dictionary = await getDictionary(params.lang); // Direkt params kullanın
  return (
    <>
      <SchoolTransport dictionary={dictionary.schoolTransportPage} />
    </>
  );
};

export default SchoolTransportPage;
