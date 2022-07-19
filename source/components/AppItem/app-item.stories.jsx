import FleekImg from '@assets/icons/Fleek.svg';
import DeleteImg from '@assets/icons/delete.svg';
import AppItem from './index';

export default {
  title: 'UI/AppItem',
  component: AppItem,
};

const Template = (args) => <AppItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'fleek.ooo',
  image: FleekImg,
  icon: DeleteImg,
  action: 'delete',
  onClick: () => null,
};
