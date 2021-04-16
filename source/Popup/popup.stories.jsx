import Popup from './Popup';

export default {
  title: 'Popup',
  component: Popup,
};

const Template = (args) => <div style={{ width: 450, margin: 20, boxShadow: '0 0 10px' }}><Popup {...args} /></div>;

export const Default = Template.bind({});
Default.args = {};
