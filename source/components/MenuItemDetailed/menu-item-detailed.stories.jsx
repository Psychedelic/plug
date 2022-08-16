import Image from '@assets/icons/settings/pen.svg';
import MenuItemDetailed from './index';

export default {
  title: 'UI/MenuItemDetailed',
  component: MenuItemDetailed,
};

const Template = (args) => <MenuItemDetailed {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'Wallet Name',
  description: 'Change the name of your wallet.',
  image: Image,
  onClick: (() => null),
};
