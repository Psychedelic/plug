import NavBar from './index';

export default {
  title: 'Components/NavBar',
  component: NavBar,
};

const Template = (args) => <NavBar {...args} />;

export const Default = Template.bind({});
Default.args = {};
