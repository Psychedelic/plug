import Plug from './index';

export default {
  title: 'Components/Plug',
  component: Plug,
};

const Template = (args) => <Plug {...args} />;

export const Default = Template.bind({});
Default.args = {};
