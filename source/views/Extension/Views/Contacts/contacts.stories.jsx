import Contacts from './index';

export default {
  title: 'Contacts',
  component: Contacts,
};

const Template = (args) => <div style={{ width: 420, margin: 20, boxShadow: '0 0 10px' }}><Contacts {...args} /></div>;

export const Default = Template.bind({});
Default.args = {};
