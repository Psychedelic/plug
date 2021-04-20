import TextInput from './index';

export default {
  title: 'UI/TextInput',
  component: TextInput,
};

const Template = (args) => <TextInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  type: 'password',
  value: '420',
  onChange: () => null,
};
