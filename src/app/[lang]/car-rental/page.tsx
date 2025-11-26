import CarRental from "@/components/CarRental";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

const CarRentalPage = async ({
  params,
}: {
   params: Promise<{ lang: Locale }>;
}) => {
  const resolvedParams = await params;
   const dictionary = await getDictionary(resolvedParams.lang);
  return (
    <>
      <CarRental dictionary={dictionary.carRentalPage} />
    </>
  );
};

export default CarRentalPage;