import Welcome from './index';

export default {
  title: 'Welcome',
  component: Welcome,
};

const Template = (args) => <Welcome {...args} />;

export const Default = Template.bind({});
Default.args = {};
