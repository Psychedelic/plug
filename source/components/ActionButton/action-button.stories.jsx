import ActionButton from './index';

export default {
  title: 'UI/ActionButton',
  component: ActionButton,
};

const Template = (args) => <ActionButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  type: 'send',
  onClick: (() => null),
};
