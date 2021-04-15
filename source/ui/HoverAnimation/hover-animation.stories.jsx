import HoverAnimation from './index';

export default {
  title: 'UI/HoverAnimation',
  component: HoverAnimation,
};

const Template = (args) => <HoverAnimation {...args}>Hover me</HoverAnimation>;

export const Default = Template.bind({});
Default.args = {};
