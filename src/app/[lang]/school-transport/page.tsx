import SchoolTransport from "@/components/SchoolTransport";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

const SchoolTransportPage = async ({
  params,
}: {
  params: Promise<{ lang: Locale }>; // Promise olarak bırakın
}) => {
  const resolvedParams = await params; // await ile çözümleyin
  const dictionary = await getDictionary(resolvedParams.lang);
  return (
    <>
      <SchoolTransport dictionary={dictionary.schoolTransportPage} />
    </>
  );
};

export default SchoolTransportPage;
