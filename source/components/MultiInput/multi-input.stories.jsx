import CyclesImg from '@assets/icons/Cycles.svg';
import MultiInput from './index';

export default {
  title: 'UI/MultiInput',
  component: MultiInput,
};

const Template = (args) => (
  <div style={{ width: 420, background: 'white' }}>
    <MultiInput {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  image: CyclesImg,
  name: 'Cycles',
  primaryValue: {
    prefix: '', // TODO: add business logic
  },
  secondaryValue: {
    prefix: '', // TODO: add business logic
  },
};
