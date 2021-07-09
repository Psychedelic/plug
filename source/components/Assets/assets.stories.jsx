import Assets from './index';

export default {
  title: 'Components/Assets',
  component: Assets,
};

const Template = (args) => <Assets {...args} />;

export const Default = Template.bind({});
Default.args = {};
