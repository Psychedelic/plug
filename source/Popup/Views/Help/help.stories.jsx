import Help from './index';

export default {
  title: 'Help',
  component: Help,
};

const Template = (args) => <div style={{ width: 420, margin: 20, boxShadow: '0 0 10px' }}><Help {...args} /></div>;

export const Default = Template.bind({});
Default.args = {};
