import InfoRow from './index';

export default {
  title: 'UI/InfoRow',
  component: InfoRow,
};

const Template = (args) => <InfoRow {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'name:',
  value: 'value',
};
