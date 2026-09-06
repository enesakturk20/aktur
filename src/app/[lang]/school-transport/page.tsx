import SchoolTransport from "@/components/SchoolTransport";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

const SchoolTransportPage = async ({
  params,
}: {
  params: Promise<{ lang: string }>; // string olarak değiştirin
}) => {
  const resolvedParams = await params;
  const dictionary = await getDictionary(resolvedParams.lang as Locale);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  let company = {
    id: 1,
    name: "AKTUR TURİZM TAŞIMACILIK",
    email: "info@akturtourism.com",
    schools: []
  };

  try {
    // Fetch Company ID 1 as the default for this public page
    const res = await fetch(`${apiBaseUrl}/api/students/company-details/1`, {
      cache: "no-store",
    });
    if (res.ok) {
      company = await res.json();
    }
  } catch (err) {
    console.error("Error fetching company details on server:", err);
  }

  return (
    <>
      <SchoolTransport dictionary={dictionary.schoolTransportPage} company={company} />
    </>
  );
};

export default SchoolTransportPage;
