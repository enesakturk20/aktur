import { getDictionary } from "../../get-dictionary";
import { Locale } from "../../i18n-config";
import DashboardController from "@/components/dashboard/DashboardController";

interface DashboardPageProps {
  params: Promise<{ lang: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return <DashboardController dictionary={dictionary.portalDashboard} lang={lang} />;
}
