import CycleTransactions from './index';

export default {
  title: 'CycleTransactions',
  component: CycleTransactions,
};

const Template = (args) => <div style={{ width: 420, margin: 20, boxShadow: '0 0 10px' }}><CycleTransactions {...args} /></div>;

export const Default = Template.bind({});
Default.args = {};
