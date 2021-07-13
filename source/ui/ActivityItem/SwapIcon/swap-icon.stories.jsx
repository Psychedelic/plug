import { CURRENCIES } from '@shared/constants/currencies';
import SwapIcon from './index';

export default {
  title: 'UI/ActivityItem/SwapIcon',
  component: SwapIcon,
};

const Template = (args) => <SwapIcon {...args} />;

export const Default = Template.bind({});
Default.args = {
  fromCurrency: {
    id: 1,
    name: 'ICP',
    value: CURRENCIES.ICP,
    image: '', // TODO: add image
  },
  toCurrency: {
    id: 1,
    name: 'CYCLES',
    value: CURRENCIES.CYCLES,
    image: '', // TODO: add image
  },
  handleChangeSwap: () => null,
};
