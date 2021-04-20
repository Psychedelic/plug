import FormInput from './index';

export default {
  title: 'UI/FormInput',
  component: FormInput,
};

const Template = (args) => <FormInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  id: '1337',
  label: 'Cool input',
  type: 'password',
  value: '420',
  onChange: () => null,
};
