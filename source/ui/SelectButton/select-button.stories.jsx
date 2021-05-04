import CanisterImg from '@assets/icons/canister.svg';
import InfoImg from '@assets/icons/info.svg';
import SelectButton from './index';

export default {
  title: 'UI/SelectButton',
  component: SelectButton,
};

const Template = (args) => (
  <div style={{ width: 420, background: 'white' }}>
    <SelectButton {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  value: 'Withdaw to Canister',
  startImage: CanisterImg,
  endImage: InfoImg,
  onClick: null,
  selected: true,
};
