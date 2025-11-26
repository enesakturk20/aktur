import StaffTransport from "@/components/StaffTransport";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

const StaffTransportPage = async ({
  params,
}: {
  params: { lang: Locale }; // Promise'i kaldırın
}) => {
  const dictionary = await getDictionary(params.lang); // Direkt params kullanın
  return (
    <>
      <StaffTransport dictionary={dictionary.staffTransportPage} />
    </>
  );
};

export default StaffTransportPage;