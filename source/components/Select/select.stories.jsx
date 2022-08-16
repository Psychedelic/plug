import CyclesImg from '@assets/icons/Cycles.svg';
import Select from './index';

export default {
  title: 'UI/Select',
  component: Select,
};

const Template = (args) => (
  <div style={{ width: 500, background: 'white' }}>
    <Select {...args} />
    <Select {...args} text="More coming soon!" />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  image: CyclesImg,
  name: 'Cycles',
  shadow: true,
  onClick: null,
  text: null,
};
