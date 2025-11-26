import VipTransfer from "@/components/VipTransfer";
import { getDictionary } from "../get-dictionary";
import { Locale } from "../i18n-config";

const VipTransferPage = async ({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) => {
  const resolvedParams = await params;
  const dictionary = await getDictionary(resolvedParams.lang);
  
  return (
    <>
      <VipTransfer dictionary={dictionary.vipTransferPage} />
    </>
  );
};

export default VipTransferPage;