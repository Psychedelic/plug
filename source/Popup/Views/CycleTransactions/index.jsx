import React from 'react';
import { Layout } from '@components';
import { Tabs, Button, Container } from '@ui';
import { useTranslation } from 'react-i18next';
import FleekImg from '@assets/icons/Fleek.svg';
import useStyles from './styles';
import Details from './components/Details';
import Data from './components/Data';

const CycleTransactions = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  const tabs = [
    {
      label: t('cycleTransactions.details'),
      component: <Details />,
    },
    {
      label: t('cycleTransactions.data'),
      component: <Data url="https://fleek.xyz" image={FleekImg} cycles={2.50} />,
    },
  ];

  return (
    <Layout>
      <Tabs tabs={tabs} />
      <Container>
        <div className={classes.buttonContainer}>
          <Button variant="default" value={t('common.decline')} onClick={() => null} style={{ width: '48%' }} />
          <Button variant="rainbow" value={t('common.allow')} onClick={() => null} style={{ width: '48%' }} />
        </div>
      </Container>
    </Layout>
  );
};

export default CycleTransactions;
