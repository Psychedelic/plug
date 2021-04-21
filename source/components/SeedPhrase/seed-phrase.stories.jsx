import SeedPhrase from './index';

export default {
  title: 'Components/SeedPhrase',
  component: SeedPhrase,
};

const Template = (args) => <SeedPhrase {...args} />;

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
