import FullscreenContainer from './index';

export default {
  title: 'UI/FullscreenContainer',
  component: FullscreenContainer,
};

const Template = (args) => <FullscreenContainer {...args} />;

export const Default = Template.bind({});
Default.args = {};
