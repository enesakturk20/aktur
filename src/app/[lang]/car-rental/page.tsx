import CarRental from "@/components/CarRental";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

const CarRentalPage = async ({
  params,
}: {
  params: Promise<{ lang: string }>; // string olarak değiştirin
}) => {
  const resolvedParams = await params;
  const dictionary = await getDictionary(resolvedParams.lang as Locale); // as Locale ekleyin
  return (
    <>
      <CarRental dictionary={dictionary.carRentalPage} />
    </>
  );
};

export default CarRentalPage;
