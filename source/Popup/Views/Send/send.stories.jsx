import Send from './index';

export default {
  title: 'Send',
  component: Send,
};

const Template = (args) => <div style={{ width: 420, margin: 20, boxShadow: '0 0 10px' }}><Send {...args} /></div>;

export const Default = Template.bind({});
Default.args = {};
