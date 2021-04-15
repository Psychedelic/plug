import Actions from './index';

export default {
  title: 'Components/Actions',
  component: Actions,
};

const Template = (args) => <Actions {...args} />;

export const Default = Template.bind({});
Default.args = {};
