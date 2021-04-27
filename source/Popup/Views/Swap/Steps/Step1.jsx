import React from 'react';
import { FormItem, MultiInput } from '@ui';
import { useTranslation } from 'react-i18next';

const Step1 = () => {
  const { t } = useTranslation();
    return(
        <>
            <FormItem label={t('swap.swapFrom')} component={<MultiInput />}/>
        </>
    );
};

export default Step1;
