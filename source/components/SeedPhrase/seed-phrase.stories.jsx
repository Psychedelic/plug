import SeedPhrase from './index';

export default {
  title: 'Components/SeedPhrase',
  component: SeedPhrase,
};

const Template = (args) => <div style={{ height: 178, width: 370 }}><SeedPhrase {...args} /></div>;

export const Default = Template.bind({});
Default.args = {
  words: [
    'spread',
    'spoon',
    'foam',
    'door',
    'young',
    'uniform',
    'lab',
    'add',
    'jungle',
    'display',
    'clean',
    'parrot',
  ],
};
