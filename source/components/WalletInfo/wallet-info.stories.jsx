import WalletInfo from './index';

export default {
  title: 'Components/WalletInfo',
  component: WalletInfo,
};

const Template = (args) => <WalletInfo {...args} />;

export const Default = Template.bind({});
Default.args = {};
