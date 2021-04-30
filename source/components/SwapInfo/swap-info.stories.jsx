import CyclesImg from '@assets/icons/Cycles.svg';
import DfinityImg from '@assets/icons/Dfinity.svg';
import SwapInfo from './index';

export default {
  title: 'Components/SwapInfo',
  component: SwapInfo,
};

const Template = (args) => <div style={{ width: 420 }}><SwapInfo {...args} /></div>;

export const Default = Template.bind({});
Default.args = {
  fromAsset: {
    id: 'ICP',
    name: 'ICP',
    value: 'ICP',
    image: DfinityImg,
    price: 10,
  },
  fromAmount: 120,
  toAsset: {
    id: 'CYCLES',
    name: 'Cycles',
    value: 'T Cycles',
    image: CyclesImg,
    price: 0.008,
  },
  toAmount: 150000,
};
