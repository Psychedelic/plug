import ProviderWrapper from '../../shared/ProviderWrapper';
import store from '../../redux/store';
import { theme } from '../../ui';
import Assets from './index';

export default {
  title: 'Components/Assets',
  component: Assets,
};

const Template = (args) => (
  <ProviderWrapper
    store={store}
    theme={theme}
  >
    <Assets {...args} />;
  </ProviderWrapper>
);

export const Default = Template.bind({});
Default.args = {};
