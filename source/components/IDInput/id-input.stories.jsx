import IDInput from './index';

export default {
  title: 'Components/IDInput',
  component: IDInput,
};

const Template = (args) => <div style={{ width: 420 }}><IDInput {...args} /></div>;

export const Default = Template.bind({});
Default.args = {
  addressInfo: {
    isValid: true,
  },
  contacts: [],
};
