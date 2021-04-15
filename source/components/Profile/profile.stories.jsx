import Profile from './index';

export default {
  title: 'Components/Profile',
  component: Profile,
};

const Template = (args) => <Profile {...args} />;

export const Default = Template.bind({});
Default.args = {};
