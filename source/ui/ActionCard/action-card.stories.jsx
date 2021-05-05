import ImportImg from '@assets/icons/options/importwallet.svg';
import ActionCard from './index';

export default {
  title: 'UI/ActionCard',
  component: ActionCard,
};

const Template = (args) => (
  <div
    style={{
      padding: 24,
      background: 'linear-gradient(122.45deg, rgba(255, 231, 1, 0.2) 15.68%, rgba(250, 81, 211, 0.2) 39.58%, rgba(16, 217, 237, 0.2) 63.84%, rgba(82, 255, 83, 0.2) 85.21%)',
    }}
  >
    <ActionCard {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  icon: ImportImg,
  title: 'Import Wallet',
  subtitle: 'Import using 12 word seed phrase or private key.',
  button: 'Import Wallet',
  onClick: () => null,
};
