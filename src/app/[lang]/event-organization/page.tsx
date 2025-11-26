import EventOrganization from "@/components/EventOrganization";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

const EventOrganizationPage = async ({
  params,
}: {
   params: Promise<{ lang: Locale }>;
}) => {
  const resolvedParams = await params;
   const dictionary = await getDictionary(resolvedParams.lang);
  return (
    <>
      <EventOrganization dictionary={dictionary.eventOrganizationPage} />
    </>
  );
};

export default EventOrganizationPage;