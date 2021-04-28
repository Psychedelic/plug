import Swap from './index';

export default {
  title: 'Swap',
  component: Swap,
};

const Template = (args) => <div style={{ width: 420, margin: 20, boxShadow: '0 0 10px' }}><Swap {...args} /></div>;

export const Default = Template.bind({});
Default.args = {};
