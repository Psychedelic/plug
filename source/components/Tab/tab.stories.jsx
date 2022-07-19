import Tab from './index';

export default {
  title: 'UI/Tab',
  component: Tab,
};

const Template = (args) => <Tab {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'tab',
};
