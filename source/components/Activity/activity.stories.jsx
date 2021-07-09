import Activity from './index';

export default {
  title: 'Components/Activity',
  component: Activity,
};

const Template = (args) => <Activity {...args} />;

export const Default = Template.bind({});
Default.args = {};
