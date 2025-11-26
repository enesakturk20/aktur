import SchoolTransport from "@/components/SchoolTransport";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

const SchoolTransportPage = async ({
  params,
}: {
  params: Promise<{ lang: string }>; // string olarak değiştirin
}) => {
  const resolvedParams = await params;
  const dictionary = await getDictionary(resolvedParams.lang as Locale); // as Locale ekleyin
  return (
    <>
      <SchoolTransport dictionary={dictionary.schoolTransportPage} />
    </>
  );
};

export default SchoolTransportPage;
