import ProviderWrapper from '../../shared/ProviderWrapper';
import store from '../../redux/store';
import { theme } from '../../ui';
import Activity from './index';

export default {
  title: 'Components/Activity',
  component: Activity,
};

const Template = (args) => (
  <ProviderWrapper
    store={store}
    theme={theme}
  >
    <Activity {...args} />
  </ProviderWrapper>
);

export const Default = Template.bind({});
Default.args = {};
