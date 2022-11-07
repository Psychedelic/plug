import RevealSeedPhrase from './index';

export default {
  title: 'Components/RevealSeedPhrase',
  component: RevealSeedPhrase,
};

const Template = (args) => <RevealSeedPhrase {...args} />;

export const Default = Template.bind({});
Default.args = {
  onClick: () => null,
};
