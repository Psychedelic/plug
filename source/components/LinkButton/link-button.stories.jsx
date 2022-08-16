import LinkButton from './index';

export default {
  title: 'UI/LinkButton',
  component: LinkButton,
};

const Template = (args) => <LinkButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  value: 'click me',
  onClick: () => null,
};
