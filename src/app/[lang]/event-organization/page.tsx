import EventOrganization from "@/components/EventOrganization";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

const EventOrganizationPage = async ({
  params,
}: {
  params: Promise<{ lang: string }>; // string olarak değiştirin
}) => {
  const resolvedParams = await params;
  const dictionary = await getDictionary(resolvedParams.lang as Locale); // as Locale ekleyin
  return (
    <>
      <EventOrganization dictionary={dictionary.eventOrganizationPage} />
    </>
  );
};

export default EventOrganizationPage;