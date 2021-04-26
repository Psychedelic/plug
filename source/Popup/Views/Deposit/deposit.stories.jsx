import Deposit from './index';

export default {
  title: 'Deposit',
  component: Deposit,
};

const Template = (args) => <div style={{ width: 420, margin: 20, boxShadow: '0 0 10px' }}><Deposit {...args} /></div>;

export const Default = Template.bind({});
Default.args = {};
