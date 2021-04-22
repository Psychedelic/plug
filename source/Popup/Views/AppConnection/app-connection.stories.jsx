import FleekImg from '@assets/icons/Fleek.svg';
import AppConnection from './index';

export default {
  title: 'AppConnection',
  component: AppConnection,
};

const Template = (args) => <div style={{ width: 420, margin: 20, boxShadow: '0 0 10px' }}><AppConnection {...args} /></div>;

export const Default = Template.bind({});
Default.args = {
  image: FleekImg,
  url: 'https://fleek.ooo',
};
