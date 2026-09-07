import StudentRegisterForm from "@/components/StudentRegisterForm";
import { getDictionary } from "../../get-dictionary";
import { Locale } from "../../i18n-config";
import { notFound } from "next/navigation";
import { studentService } from "@/services";

interface StudentRegisterPageProps {
  params: Promise<{
    lang: string;
    companyId: string;
  }>;
}

export default async function StudentRegisterPage({ params }: StudentRegisterPageProps) {
  const { lang, companyId } = await params;
  const dictionary = await getDictionary(lang as Locale);

  let company = null;
  try {
    company = await studentService.getCompanyDetails(companyId);
  } catch (err) {
    console.error("Error fetching company details on server:", err);
  }

  if (!company) {
    notFound();
  }

  return (
    <StudentRegisterForm 
      company={company} 
      dictionary={dictionary.schoolTransportPage} 
    />
  );
}
