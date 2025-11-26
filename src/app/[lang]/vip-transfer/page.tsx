import VipTransfer from "@/components/VipTransfer";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

const VipTransferPage = async ({
  params,
}: {
  params: { lang: Locale }; // Promise'i kaldırın
}) => {
  const dictionary = await getDictionary(params.lang); // Direkt params kullanın
  
  return (
    <>
      <VipTransfer dictionary={dictionary.vipTransferPage} />
    </>
  );
};

export default VipTransferPage;