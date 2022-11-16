import React from 'react';
import { Layout, Header, MenuItemDetailed } from '@components';
import { LinkButton } from '@components';
import { useTranslation } from 'react-i18next';
import BackIcon from '@assets/icons/back.svg';
import { useRouter } from '@components/Router';
import PaperEmoji from "@assets/paper.svg"
import NewKey from "@assets/new-key.svg"

const ImportWallet = () => {
  const { t } = useTranslation();
  const { navigator } = useRouter();

  
  const left = <LinkButton value={t('common.back')} onClick={() => navigator.navigate('home')} startIcon={BackIcon} />;
  const right = <LinkButton value={t('common.close')} onClick={() => navigator.navigate('home')} />;
  const center = `${t("importWallet.importWallet")}`
  

  return (
    <Layout>
      <Header left={left} center={center} right={right} />
      <MenuItemDetailed logo={PaperEmoji} name={`${t("importPem.importPEMfile")}`} description={`${t("importPem.description")}`} onClick={() => navigator.navigate('import-pem-file')}/>
      <MenuItemDetailed logo={NewKey} name={`${t("importPrivateKey.importPrivateKey")}`} description={`${t("importPrivateKey.description")}`} onClick={() => navigator.navigate('import-private-key')}/>
    </Layout>
  );
};

export default ImportWallet;
