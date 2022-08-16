import Alert from './index';

export default {
  title: 'UI/Alert',
  component: Alert,
};

const Template = (args) => <Alert {...args} />;

export const Default = Template.bind({});
Default.args = {
  type: 'warning',
  title: 'Not enough cycles',
  subtitle: 'You dont’ have enough Cycles in your wallet to process this transaction. Please get more cycles to continue.',
  startIcon: true,
  endIcon: false,
  url: null,
};
