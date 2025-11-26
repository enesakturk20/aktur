import VipTransfer from "@/components/VipTransfer";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

const VipTransferPage = async ({
  params,
}: {
  params: Promise<{ lang: string }>; // string olarak değiştirin
}) => {
  const resolvedParams = await params;
  const dictionary = await getDictionary(resolvedParams.lang as Locale); // as Locale ekleyin
  
  return (
    <>
      <VipTransfer dictionary={dictionary.vipTransferPage} />
    </>
  );
};

export default VipTransferPage;