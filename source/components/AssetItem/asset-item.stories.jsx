import Image from '@assets/icons/Dfinity.svg';
import AssetItem from './index';

export default {
  title: 'UI/AssetItem',
  component: AssetItem,
};

const Template = (args) => <AssetItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  image: Image,
  name: 'Dfinity',
  amount: 420,
  value: 1337.69,
  currency: 'ICP',
};
