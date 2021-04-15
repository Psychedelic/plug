import Image from '@assets/icons/settings.png';
import MenuItem from './index';

export default {
  title: 'UI/MenuItem',
  component: MenuItem,
};

const Template = (args) => <MenuItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'Settings',
  image: Image,
  onClick: (() => null),
};
