import Options from './Views/Welcome/index';

export default {
  title: 'Options',
  component: Options,
};

const Template = (args) => <Options {...args} />;

export const Default = Template.bind({});
Default.args = {};
