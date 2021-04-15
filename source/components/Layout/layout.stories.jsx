import Layout from './index';

export default {
  title: 'Components/Layout',
  component: Layout,
};

const Template = (args) => <Layout {...args} />;

export const Default = Template.bind({});
Default.args = {};
