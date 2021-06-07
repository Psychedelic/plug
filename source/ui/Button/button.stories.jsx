import Button from './index';

export default {
  title: 'UI/Button',
  component: Button,
};

const Template = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  variant: 'rainbow',
  value: 'Dank',
  onClick: () => null,
};
