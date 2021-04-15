import ConnectionStatus from './index';

export default {
  title: 'Components/ConnectionStatus',
  component: ConnectionStatus,
};

const Template = (args) => <ConnectionStatus {...args} />;

export const Default = Template.bind({});
Default.args = {
  status: 'plugged',
  web: 'fleek.ooo',
};
