import Settings from './index';

export default {
  title: 'Settings',
  component: Settings,
};

const Template = (args) => <div style={{ width: 420, margin: 20, boxShadow: '0 0 10px' }}><Settings {...args} /></div>;

export const Default = Template.bind({});
Default.args = {};
