import WalletInfo from './index';
import ProviderWrapper from '../../shared/ProviderWrapper';
import store from '../../redux/store';
import { theme } from '../../ui';

export default {
  title: 'Components/WalletInfo',
  component: WalletInfo,
};

const Template = (args) => (
  <ProviderWrapper
    store={store}
    theme={theme}
  >
    <WalletInfo {...args} />
  </ProviderWrapper>
);

export const Default = Template.bind({});
Default.args = {};
