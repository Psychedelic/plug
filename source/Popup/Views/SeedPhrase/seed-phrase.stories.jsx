import SeedPhrase from './index';

export default {
  title: 'SeedPhrase',
  component: SeedPhrase,
};

const Template = (args) => <div style={{ width: 420, margin: 20, boxShadow: '0 0 10px' }}><SeedPhrase {...args} /></div>;

export const Default = Template.bind({});
Default.args = {};
