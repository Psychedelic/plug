import FleekImg from '@assets/icons/Fleek.svg';
import GenericIcon from './index';

export default {
  title: 'UI/GenericIcon',
  component: GenericIcon,
};

const Template = (args) => <GenericIcon {...args} />;

export const Default = Template.bind({});
Default.args = {
  image: FleekImg,
  type: null,
};
