import Login from './index';

export default {
  title: 'Login',
  component: Login,
};

const Template = (args) => <div style={{ width: 420, margin: 20, boxShadow: '0 0 10px' }}><Login {...args} /></div>;

export const Default = Template.bind({});
Default.args = {};
