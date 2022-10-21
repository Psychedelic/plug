import HardwareWallet from './Views/Welcome/index';

export default {
  title: 'HarwareWallet',
  component: HardwareWallet,
};

const Template = (args) => <HardwareWallet {...args} />;

export const Default = Template.bind({});
Default.args = {};
