import StaffTransport from "@/components/StaffTransport";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

const StaffTransportPage = async ({
  params,
}: {
 params: Promise<{ lang: string }>; // string olarak değiştirin
}) => {
  const resolvedParams = await params;
  const dictionary = await getDictionary(resolvedParams.lang as Locale); // as Locale ekleyin
  return (
    <>
      <StaffTransport dictionary={dictionary.staffTransportPage} />
    </>
  );
};

export default StaffTransportPage;