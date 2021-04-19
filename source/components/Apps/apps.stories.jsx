import Apps from './index';

export default {
  title: 'Components/Apps',
  component: Apps,
};

const Template = (args) => <Apps {...args} />;

export const Default = Template.bind({});
Default.args = {};
