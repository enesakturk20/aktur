import StudentRegisterForm from "@/components/StudentRegisterForm";
import { getDictionary } from "../../get-dictionary";
import { Locale } from "../../i18n-config";
import { notFound } from "next/navigation";

interface StudentRegisterPageProps {
  params: Promise<{
    lang: string;
    companyId: string;
  }>;
}

export default async function StudentRegisterPage({ params }: StudentRegisterPageProps) {
  const { lang, companyId } = await params;
  const dictionary = await getDictionary(lang as Locale);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  
  let company = null;
  try {
    const res = await fetch(`${apiBaseUrl}/api/students/company-details/${companyId}`, {
      cache: "no-store",
    });
    if (res.ok) {
      company = await res.json();
    }
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
