import StaffTransport from "@/components/StaffTransport";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

const StaffTransportPage = async ({
  params,
}: {
   params: Promise<{ lang: Locale }>;
}) => {
  const resolvedParams = await params;
   const dictionary = await getDictionary(resolvedParams.lang);
  return (
    <>
      <StaffTransport dictionary={dictionary.staffTransportPage} />
    </>
  );
};

export default StaffTransportPage;