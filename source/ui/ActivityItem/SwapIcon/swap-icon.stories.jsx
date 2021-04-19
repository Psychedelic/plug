import { CURRENCIES } from '@shared/constants/currencies';
import SwapIcon from './index';

export default {
  title: 'UI/ActivityItem/SwapIcon',
  component: SwapIcon,
};

const Template = (args) => <SwapIcon {...args} />;

export const Default = Template.bind({});
Default.args = {
  fromCurrency: CURRENCIES.ICP,
  toCurrency: CURRENCIES.CYCLES,
  handleChangeSwap: () => null,
};
