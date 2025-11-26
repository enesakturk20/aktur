import CarRental from "@/components/CarRental";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

const CarRentalPage = async ({
  params,
}: {
  params: { lang: Locale }; // Promise'i kaldırın
}) => {
  const dictionary = await getDictionary(params.lang); // Direkt params kullanın
  return (
    <>
      <CarRental dictionary={dictionary.carRentalPage} />
    </>
  );
};

export default CarRentalPage;
