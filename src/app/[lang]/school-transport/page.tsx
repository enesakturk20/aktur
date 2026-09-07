import SchoolTransport from "@/components/SchoolTransport";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";
import { studentService } from "@/services";
import { CompanyDetails } from "@/models";

const SchoolTransportPage = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}) => {
  const resolvedParams = await params;
  const dictionary = await getDictionary(resolvedParams.lang as Locale);

  let company: CompanyDetails = {
    id: 1,
    name: "AKTUR TURİZM TAŞIMACILIK",
    email: "info@akturtourism.com",
    schools: [],
  };

  try {
    company = await studentService.getCompanyDetails(1);
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
