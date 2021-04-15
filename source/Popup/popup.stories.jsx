import Popup from './Popup';

export default {
  title: 'Popup',
  component: Popup,
};

const Template = (args) => <div style={{ width: 450, margin: 20 }}><Popup {...args} /></div>;

export const Default = Template.bind({});
Default.args = {};
