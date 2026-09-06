import PortalLoginForm from "@/components/PortalLoginForm";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

interface PortalPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function PortalPage({ params }: PortalPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return (
    <PortalLoginForm dictionary={dictionary.portalPage} />
  );
}
