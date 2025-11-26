import EventOrganization from "@/components/EventOrganization";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

const EventOrganizationPage = async ({
  params,
}: {
   params: { lang: Locale }; // Promise'i kaldırın
}) => {
  const dictionary = await getDictionary(params.lang); // Direkt params kullanın
  return (
    <>
      <EventOrganization dictionary={dictionary.eventOrganizationPage} />
    </>
  );
};

export default EventOrganizationPage;